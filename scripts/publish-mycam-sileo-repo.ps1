[CmdletBinding()]
param(
    [Parameter(Mandatory = $true)]
    [string]$DebPath,

    [switch]$Deploy
)

$ErrorActionPreference = 'Stop'

function Convert-ToWslPath {
    param([Parameter(Mandatory = $true)][string]$WindowsPath)

    $resolved = (Resolve-Path -LiteralPath $WindowsPath).Path
    if ($resolved -notmatch '^([A-Za-z]):\\(.*)$') {
        throw "Only local Windows drive paths are supported: $resolved"
    }

    $drive = $Matches[1].ToLowerInvariant()
    $tail = $Matches[2].Replace('\', '/')
    return "/mnt/$drive/$tail"
}

function Get-FileDigest {
    param([Parameter(Mandatory = $true)][System.IO.FileInfo]$File)

    [pscustomobject]@{
        Name   = $File.Name
        Size   = $File.Length
        MD5    = (Get-FileHash -LiteralPath $File.FullName -Algorithm MD5).Hash.ToLowerInvariant()
        SHA1   = (Get-FileHash -LiteralPath $File.FullName -Algorithm SHA1).Hash.ToLowerInvariant()
        SHA256 = (Get-FileHash -LiteralPath $File.FullName -Algorithm SHA256).Hash.ToLowerInvariant()
    }
}

function Write-Utf8NoBom {
    param(
        [Parameter(Mandatory = $true)][string]$Path,
        [Parameter(Mandatory = $true)][string]$Content
    )

    [System.IO.File]::WriteAllText($Path, $Content, [System.Text.UTF8Encoding]::new($false))
}

$resolvedDeb = (Resolve-Path -LiteralPath $DebPath).Path
$wslDeb = Convert-ToWslPath $resolvedDeb
$projectRoot = Split-Path -Parent $PSScriptRoot
$repoRoot = Join-Path $projectRoot 'docs\sileo'
$debsRoot = Join-Path $repoRoot 'debs'
$packagesPath = Join-Path $repoRoot 'Packages'
$releasePath = Join-Path $repoRoot 'Release'
$baseUrl = 'https://elementtime6969.github.io/mycam/sileo'
$homepageUrl = 'https://shareswhatyoucan.com/mycam/'

$version = (& wsl.exe -e dpkg-deb -f $wslDeb Version | Out-String).Trim()
$packageName = (& wsl.exe -e dpkg-deb -f $wslDeb Package | Out-String).Trim()
$architecture = (& wsl.exe -e dpkg-deb -f $wslDeb Architecture | Out-String).Trim()
$installedSize = (& wsl.exe -e dpkg-deb -f $wslDeb Installed-Size | Out-String).Trim()
$depends = (& wsl.exe -e dpkg-deb -f $wslDeb Depends | Out-String).Trim()

if ($packageName -ne 'com.destiny.mycamios') {
    throw "Unexpected package ID: $packageName"
}

New-Item -ItemType Directory -Force -Path $debsRoot | Out-Null
Get-ChildItem -LiteralPath $debsRoot -Filter '*.deb' -File | Remove-Item -Force

$repoDebName = "${packageName}_${version}_${architecture}.deb"
$repoDebPath = Join-Path $debsRoot $repoDebName
Copy-Item -LiteralPath $resolvedDeb -Destination $repoDebPath -Force
$deb = Get-FileDigest (Get-Item -LiteralPath $repoDebPath)

$packageText = @"
Package: $packageName
Name: MYCAM iOS
Version: $version
Architecture: $architecture
Description: MYCAM virtual camera app and tweak for jailbroken iPhones.
Maintainer: Destiny
Author: Destiny
Section: Tweaks
Depends: $depends
Filename: debs/$repoDebName
Size: $($deb.Size)
Installed-Size: $installedSize
MD5sum: $($deb.MD5)
SHA1: $($deb.SHA1)
SHA256: $($deb.SHA256)
Icon: $baseUrl/CydiaIcon.png
Homepage: $homepageUrl
Depiction: $baseUrl/package/
SileoDepiction: $baseUrl/depictions/com.destiny.mycamios.json

"@
Write-Utf8NoBom -Path $packagesPath -Content $packageText

$wslPackages = Convert-ToWslPath $packagesPath
& wsl.exe -e gzip -9 -k -f $wslPackages
& wsl.exe -e bzip2 -9 -k -f $wslPackages
& wsl.exe -e xz -9 -k -f $wslPackages

$indexes = @('Packages', 'Packages.bz2', 'Packages.gz', 'Packages.xz') | ForEach-Object {
    Get-FileDigest (Get-Item -LiteralPath (Join-Path $repoRoot $_))
}

$release = @(
    'Origin: MYCAM'
    'Label: MYCAM'
    'Suite: stable'
    'Version: 1.0'
    'Codename: mycam'
    'Architectures: iphoneos-arm64'
    'Components: main'
    'Description: Official MYCAM iOS repository'
    "Date: $([DateTime]::UtcNow.ToString('r'))"
    'MD5Sum:'
)
$release += $indexes | ForEach-Object { " $($_.MD5) $($_.Size) $($_.Name)" }
$release += 'SHA1:'
$release += $indexes | ForEach-Object { " $($_.SHA1) $($_.Size) $($_.Name)" }
$release += 'SHA256:'
$release += $indexes | ForEach-Object { " $($_.SHA256) $($_.Size) $($_.Name)" }
Write-Utf8NoBom -Path $releasePath -Content (($release -join "`n") + "`n")

$signingIdentity = 'MYCAM Repository <repo@shareswhatyoucan.com>'
$wslRepoRoot = Convert-ToWslPath $repoRoot
& wsl.exe -e gpg --batch --yes --local-user $signingIdentity --output "$wslRepoRoot/Release.gpg" --detach-sign "$wslRepoRoot/Release"
if ($LASTEXITCODE -ne 0) {
    throw 'Unable to create Release.gpg. Make sure the MYCAM Repository GPG key exists in WSL.'
}
& wsl.exe -e gpg --batch --yes --local-user $signingIdentity --output "$wslRepoRoot/InRelease" --clearsign "$wslRepoRoot/Release"
if ($LASTEXITCODE -ne 0) {
    throw 'Unable to create InRelease. Make sure the MYCAM Repository GPG key exists in WSL.'
}
& wsl.exe -e gpg --batch --yes --armor --output "$wslRepoRoot/repo-key.asc" --export $signingIdentity
if ($LASTEXITCODE -ne 0) {
    throw 'Unable to export the MYCAM repository public key.'
}

$indexPath = Join-Path $repoRoot 'index.html'
$index = Get-Content -Raw -LiteralPath $indexPath
$index = [regex]::Replace($index, 'Current version [0-9]+(?:\.[0-9]+)+', "Current version $version")
$index = [regex]::Replace($index, 'com\.destiny\.mycamios_[0-9]+(?:\.[0-9]+)+_iphoneos-arm64\.deb', $repoDebName)
$index = [regex]::Replace($index, '<span class="tag">[0-9]+(?:\.[0-9]+)+</span>', "<span class=`"tag`">$version</span>", 1)
Write-Utf8NoBom -Path $indexPath -Content $index

$packagePagePath = Join-Path $repoRoot 'package\index.html'
$packagePage = Get-Content -Raw -LiteralPath $packagePagePath
$packagePage = [regex]::Replace($packagePage, 'MYCAM iOS [0-9]+(?:\.[0-9]+)+', "MYCAM iOS $version")
$packagePage = [regex]::Replace($packagePage, '<strong>[0-9]+(?:\.[0-9]+)+</strong>', "<strong>$version</strong>", 1)
Write-Utf8NoBom -Path $packagePagePath -Content $packagePage

$depictionPath = Join-Path $repoRoot 'depictions\com.destiny.mycamios.json'
$depiction = Get-Content -Raw -LiteralPath $depictionPath | ConvertFrom-Json
$detailsTab = $depiction.tabs | Where-Object { $_.tabname -eq 'Details' }
($detailsTab.views | Where-Object { $_.class -eq 'DepictionTableTextView' -and $_.title -eq 'Version' }).text = $version
$changelogTab = $depiction.tabs | Where-Object { $_.tabname -eq 'Changelog' }
($changelogTab.views | Where-Object { $_.class -eq 'DepictionHeaderView' }).title = $version
Write-Utf8NoBom -Path $depictionPath -Content ($depiction | ConvertTo-Json -Depth 10)

Write-Host "MYCAM Sileo repository prepared with version $version."

if ($Deploy) {
    Push-Location $projectRoot
    try {
        & npx.cmd firebase-tools deploy --only hosting
        if ($LASTEXITCODE -ne 0) {
            throw "Firebase Hosting deployment failed with exit code $LASTEXITCODE."
        }
    }
    finally {
        Pop-Location
    }
}
