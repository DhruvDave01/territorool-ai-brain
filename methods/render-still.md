# Render a still

How to produce the PNG the [Guardian](../brains/ui-ux-guardian.md) asks for before any HTML. Worked example: [features/settings-mobile-totals.png](../features/settings-mobile-totals.png), built from [render-still-template.html](render-still-template.html).

The idea: do not redraw the phone. Crop the real still for everything that does not change, and draw only the new part with the brain's fonts and icons. The result is pixel-identical chrome and a new region that uses the live tokens.

## Facts you need

| | Mobile (iPhone 17 Pro Max simulator) |
|---|---|
| Still size | 1320 × 2868 px |
| CSS size | 440 × 956 px at device scale 3 |
| Fonts | `assets/fonts/mobile/DIN-Condensed-Bold.ttf` (titles, labels, buttons) and `DIN-Condensed-Regular.ttf` (body; the file is FF DIN Regular) |
| Icons | `assets/images/mobile/*.png`, tinted `#124ac6` with a CSS mask |
| Surface | `#F6F7FB` body, `#fff` cards, radius 16, border `#EDEFF3` |
| Renderer | Google Chrome headless, already on this Mac |

Web stills are 1440 wide at scale 1 for `_w1440` files. Use the same method with `--window-size=1440,<height>`.

## Steps

1. Copy the still, the two DIN files, and the icons you need into a scratch folder. Name the still `still.png`.
2. Copy `render-still-template.html` next to them. It shows the still at `background-size: 440px 956px` in absolutely positioned `.crop` divs. Each crop is `top` (where it lands) plus `background-position: 0 -<y>` (where it comes from in the still). Measure `y` on the still in CSS px: still pixel row ÷ 3.
3. Insert the new region as normal HTML between two crops. Use `@font-face` for the DIN files and `mask-image` for icon tints. Move the crops below it down by the region's height.
4. Render:

```bash
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless=new --disable-gpu \
  --hide-scrollbars --allow-file-access-from-files \
  --window-size=440,956 --force-device-scale-factor=3 \
  --screenshot=out.png "file://$PWD/page.html"
```

`--allow-file-access-from-files` is required or the icon masks render as empty circles.

5. Open `out.png` and read it before handing it over. The design gate's picture checks apply: island in the status bar, no clipped label, no crop seam. A seam means one crop's `top` and the previous crop's `top + height` do not meet; fix the numbers, do not blur it.
6. Save the PNG in the brain next to the feature it belongs to (`features/<feature>-<surface>-<change>.png`) and link it from that feature page.

## Do not

- Do not draw the status bar, header, or footer by hand when the still has them.
- Do not use a phone frame on a desk, a device mock, or a diagram of the flow.
- Do not pull a font or icon from a CDN. The files are in `assets/`.
- Do not hand back the HTML unless the user asks for HTML. The HTML is a tool for making the PNG.
