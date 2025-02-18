$imageUrls = @(
    @{
        url = "https://img.freepik.com/free-vector/medical-technology-science-background-with-hexagonal-shapes_1017-26870.jpg"
        filename = "hero-bg.jpg"
    },
    @{
        url = "https://img.freepik.com/free-vector/artificial-intelligence-healthcare_53876-90478.jpg"
        filename = "hero-illustration.png"
    },
    @{
        url = "https://img.freepik.com/free-photo/medical-banner-with-doctor-working-laptop_23-2149611228.jpg"
        filename = "about-hero.jpg"
    }
)

foreach ($image in $imageUrls) {
    $outFile = Join-Path $PSScriptRoot "images\$($image.filename)"
    Invoke-WebRequest -Uri $image.url -OutFile $outFile
    Write-Host "Downloaded $($image.filename)"
}
