# -*- coding: utf-8 -*-
import os
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.lib.colors import HexColor, white, black
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.enums import TA_LEFT, TA_CENTER, TA_JUSTIFY
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle,
    PageBreak, HRFlowable, Frame, PageTemplate, BaseDocTemplate
)
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfbase.pdfmetrics import registerFontFamily
from reportlab.pdfgen import canvas as canvasmod

# Register Vietnamese-compatible fonts
FONTS_DIR = "C:/Windows/Fonts"
pdfmetrics.registerFont(TTFont("Arial", os.path.join(FONTS_DIR, "arial.ttf")))
pdfmetrics.registerFont(TTFont("Arial-Bold", os.path.join(FONTS_DIR, "arialbd.ttf")))
pdfmetrics.registerFont(TTFont("Arial-Italic", os.path.join(FONTS_DIR, "ariali.ttf")))
pdfmetrics.registerFont(TTFont("Arial-BoldItalic", os.path.join(FONTS_DIR, "arialbi.ttf")))
registerFontFamily('Arial', normal='Arial', bold='Arial-Bold', italic='Arial-Italic', boldItalic='Arial-BoldItalic')

# Register Segoe UI Symbol for checkbox glyphs
pdfmetrics.registerFont(TTFont("SegoeSymbol", os.path.join(FONTS_DIR, "seguisym.ttf")))

# Colors
PRIMARY = HexColor("#1a56db")
PRIMARY_LIGHT = HexColor("#e8edfb")
DARK = HexColor("#1f2937")
GRAY = HexColor("#6b7280")
LIGHT_BG = HexColor("#f9fafb")
ACCENT_GREEN = HexColor("#059669")
BORDER = HexColor("#e5e7eb")
WHITE = white

# Page dimensions
PAGE_W, PAGE_H = A4
LEFT_M = 20*mm
RIGHT_M = 20*mm
TOP_M = 28*mm   # extra space for header
BOTTOM_M = 22*mm  # extra space for footer

# Styles
style_h1 = ParagraphStyle('H1', fontName='Arial-Bold', fontSize=16, textColor=PRIMARY, spaceBefore=8*mm, spaceAfter=5*mm)
style_h2 = ParagraphStyle('H2', fontName='Arial-Bold', fontSize=13, textColor=DARK, spaceBefore=6*mm, spaceAfter=3*mm)
style_body = ParagraphStyle('Body', fontName='Arial', fontSize=10, textColor=DARK, leading=16, spaceAfter=2*mm, alignment=TA_JUSTIFY)
style_bullet = ParagraphStyle('Bullet', fontName='Arial', fontSize=10, textColor=DARK, leading=16, leftIndent=12*mm, bulletIndent=5*mm, spaceAfter=1.5*mm)
style_example = ParagraphStyle('Example', fontName='Arial-Italic', fontSize=9.5, textColor=GRAY, leading=15, leftIndent=8*mm, rightIndent=8*mm, spaceBefore=2*mm, spaceAfter=3*mm, backColor=LIGHT_BG, borderPadding=(3*mm, 3*mm, 3*mm, 3*mm))
style_small = ParagraphStyle('Small', fontName='Arial', fontSize=9, textColor=GRAY, alignment=TA_CENTER)
style_table_header = ParagraphStyle('TH', fontName='Arial-Bold', fontSize=9, textColor=WHITE, alignment=TA_CENTER)
style_table_cell = ParagraphStyle('TD', fontName='Arial', fontSize=9, textColor=DARK, alignment=TA_CENTER)
style_table_cell_left = ParagraphStyle('TDL', fontName='Arial', fontSize=9, textColor=DARK, alignment=TA_LEFT)

OUTPUT = "Tanoshi_Vietnam_Mo_Ta_Chuc_Nang.pdf"

# ── Header / Footer ──────────────────────────────────────────────
class HeaderFooterCanvas(canvasmod.Canvas):
    """Canvas that draws header and footer on every page."""

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._page_number = 0

    def showPage(self):
        self._page_number += 1
        self._draw_header_footer()
        super().showPage()

    def _draw_header_footer(self):
        self.saveState()

        # ── HEADER ──
        # Blue line
        y_line = PAGE_H - 16*mm
        self.setStrokeColor(PRIMARY)
        self.setLineWidth(1.2)
        self.line(LEFT_M, y_line, PAGE_W - RIGHT_M, y_line)

        # Left: brand name
        self.setFont("Arial-Bold", 9)
        self.setFillColor(PRIMARY)
        self.drawString(LEFT_M, y_line + 3*mm, "TANOSHI VIETNAM")

        # Right: document title
        self.setFont("Arial", 8)
        self.setFillColor(GRAY)
        self.drawRightString(PAGE_W - RIGHT_M, y_line + 3*mm, "M\u00f4 t\u1ea3 ch\u1ee9c n\u0103ng h\u1ec7 th\u1ed1ng")

        # ── FOOTER ──
        y_foot = 12*mm
        self.setStrokeColor(BORDER)
        self.setLineWidth(0.5)
        self.line(LEFT_M, y_foot + 4*mm, PAGE_W - RIGHT_M, y_foot + 4*mm)

        self.setFont("Arial", 8)
        self.setFillColor(GRAY)
        self.drawString(LEFT_M, y_foot, "Tanoshi Vietnam \u2013 H\u1ec7 th\u1ed1ng Qu\u1ea3n l\u00fd Trung t\u00e2m Gi\u00e1o d\u1ee5c")
        self.drawRightString(PAGE_W - RIGHT_M, y_foot, f"Trang {self._page_number}")

        self.restoreState()


# ── Helpers ───────────────────────────────────────────────────────
def hr():
    return HRFlowable(width="100%", thickness=0.5, color=BORDER, spaceBefore=3*mm, spaceAfter=3*mm)

def bullet(text):
    return Paragraph(f"<bullet>&bull;</bullet> {text}", style_bullet)

def sub_bullet(text):
    s = ParagraphStyle('SubBullet', parent=style_bullet, leftIndent=20*mm, bulletIndent=14*mm, fontSize=9.5)
    return Paragraph(f"<bullet>-</bullet> {text}", s)

def example(text):
    return Paragraph(text, style_example)


# ── Build PDF ─────────────────────────────────────────────────────
def build_pdf():
    doc = SimpleDocTemplate(
        OUTPUT, pagesize=A4,
        leftMargin=LEFT_M, rightMargin=RIGHT_M,
        topMargin=TOP_M, bottomMargin=BOTTOM_M,
        title="Tanoshi Vietnam - M\u00f4 t\u1ea3 ch\u1ee9c n\u0103ng",
        author="Tanoshi Vietnam"
    )
    story = []

    # ══════════════════  TRANG B\u00ccA  ══════════════════
    story.append(Spacer(1, 35*mm))
    story.append(Paragraph("TANOSHI VIETNAM", ParagraphStyle('Brand', fontName='Arial-Bold', fontSize=30, textColor=PRIMARY, alignment=TA_CENTER, spaceAfter=6*mm)))
    story.append(HRFlowable(width="40%", thickness=2, color=PRIMARY, spaceBefore=2*mm, spaceAfter=8*mm))
    story.append(Paragraph("H\u1ec6 TH\u1ed0NG QU\u1ea2N L\u00dd TRUNG T\u00c2M GI\u00c1O D\u1ee4C", ParagraphStyle('CT', fontName='Arial-Bold', fontSize=16, textColor=DARK, alignment=TA_CENTER, spaceAfter=4*mm)))
    story.append(Paragraph("M\u00d4 T\u1ea2 CH\u1ee8C N\u0102NG CHI TI\u1ebeT", ParagraphStyle('CS', fontName='Arial', fontSize=13, textColor=GRAY, alignment=TA_CENTER, spaceAfter=20*mm)))

    # Role intro table
    role_data = [
        [Paragraph("<b>Vai tr\u00f2</b>", style_table_header),
         Paragraph("<b>\u0110\u1ed1i t\u01b0\u1ee3ng</b>", style_table_header),
         Paragraph("<b>M\u1ee5c \u0111\u00edch</b>", style_table_header)],
        [Paragraph("Qu\u1ea3n tr\u1ecb vi\u00ean<br/>(Admin)", style_table_cell),
         Paragraph("Ch\u1ee7 trung t\u00e2m<br/>Qu\u1ea3n l\u00fd", style_table_cell),
         Paragraph("Qu\u1ea3n l\u00fd to\u00e0n b\u1ed9<br/>ho\u1ea1t \u0111\u1ed9ng trung t\u00e2m", style_table_cell)],
        [Paragraph("Gi\u00e1o vi\u00ean", style_table_cell),
         Paragraph("Gi\u00e1o vi\u00ean ch\u00ednh<br/>Tr\u1ee3 gi\u1ea3ng", style_table_cell),
         Paragraph("Qu\u1ea3n l\u00fd l\u1edbp h\u1ecdc<br/>Theo d\u00f5i thu nh\u1eadp", style_table_cell)],
        [Paragraph("Ph\u1ee5 huynh", style_table_cell),
         Paragraph("Ph\u1ee5 huynh<br/>h\u1ecdc sinh", style_table_cell),
         Paragraph("Theo d\u00f5i con h\u1ecdc t\u1eadp<br/>\u0110\u00f3ng h\u1ecdc ph\u00ed", style_table_cell)],
    ]
    role_table = Table(role_data, colWidths=[45*mm, 50*mm, 60*mm])
    role_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), PRIMARY),
        ('GRID', (0, 0), (-1, -1), 0.5, BORDER),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('TOPPADDING', (0, 0), (-1, -1), 4*mm),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 4*mm),
        ('LEFTPADDING', (0, 0), (-1, -1), 3*mm),
        ('RIGHTPADDING', (0, 0), (-1, -1), 3*mm),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [WHITE, LIGHT_BG]),
    ]))
    story.append(role_table)
    story.append(Spacer(1, 15*mm))
    story.append(Paragraph("Webapp h\u1ed7 tr\u1ee3 c\u1ea3 h\u1ecdc online (Zoom) v\u00e0 offline", style_small))
    story.append(Paragraph("Giao di\u1ec7n t\u01b0\u01a1ng th\u00edch \u0111i\u1ec7n tho\u1ea1i, m\u00e1y t\u00ednh b\u1ea3ng v\u00e0 m\u00e1y t\u00ednh", style_small))
    story.append(PageBreak())

    # ══════════════════  PH\u1ea6N 1: ADMIN  ══════════════════
    story.append(Paragraph("PH\u1ea6N 1: QU\u1ea2N TR\u1eca VI\u00caN (ADMIN)", style_h1))
    story.append(Paragraph("Ng\u01b0\u1eddi qu\u1ea3n l\u00fd to\u00e0n b\u1ed9 trung t\u00e2m. \u0110\u0103ng nh\u1eadp v\u00e0o s\u1ebd th\u1ea5y 8 m\u1ee5c ch\u1ee9c n\u0103ng ch\u00ednh.", style_body))
    story.append(hr())

    # 1.1
    story.append(Paragraph("1.1  Qu\u1ea3n l\u00fd Ng\u01b0\u1eddi d\u00f9ng", style_h2))
    story.append(Paragraph("N\u01a1i qu\u1ea3n l\u00fd to\u00e0n b\u1ed9 con ng\u01b0\u1eddi trong trung t\u00e2m, chia th\u00e0nh 4 nh\u00f3m:", style_body))

    story.append(Paragraph("<b>H\u1ecdc sinh:</b>", style_body))
    story.append(bullet("Xem danh s\u00e1ch t\u1ea5t c\u1ea3 h\u1ecdc sinh: h\u1ecd t\u00ean, kh\u1ed1i l\u1edbp (6\u20139), tr\u00ecnh \u0111\u1ed9 (c\u01a1 b\u1ea3n / trung b\u00ecnh / n\u00e2ng cao), ph\u1ee5 huynh, tr\u1ea1ng th\u00e1i"))
    story.append(bullet("B\u1ea5m v\u00e0o t\u00ean h\u1ecdc sinh \u0111\u1ec3 xem chi ti\u1ebft:"))
    story.append(sub_bullet("Th\u00f4ng tin c\u00e1 nh\u00e2n (ng\u00e0y sinh, l\u1edbp, tr\u00ecnh \u0111\u1ed9)"))
    story.append(sub_bullet("<b>Bi\u1ec3u \u0111\u1ed3 h\u00ecnh m\u1ea1ng nh\u1ec7n</b> th\u1ec3 hi\u1ec7n 6 ti\u00eau ch\u00ed \u0111\u00e1nh gi\u00e1: Ti\u1ebfp thu ki\u1ebfn th\u1ee9c, T\u1eadp trung tr\u00ean l\u1edbp, K\u1ef9 n\u0103ng thi, T\u1ef1 h\u1ecdc, Ch\u0103m ch\u1ec9, T\u01b0\u01a1ng t\u00e1c"))
    story.append(sub_bullet("L\u1ecbch s\u1eed \u0111i\u1ec3m danh t\u1eebng bu\u1ed5i h\u1ecdc"))
    story.append(sub_bullet("L\u1ecbch s\u1eed \u0111\u00f3ng h\u1ecdc ph\u00ed"))
    story.append(example("V\u00ed d\u1ee5: Admin mu\u1ed1n ki\u1ec3m tra h\u1ecdc sinh Nguy\u1ec5n V\u0103n A c\u00f3 \u0111i h\u1ecdc \u0111\u1ec1u kh\u00f4ng \u2192 v\u00e0o Ng\u01b0\u1eddi d\u00f9ng \u2192 ch\u1ecdn tab H\u1ecdc sinh \u2192 b\u1ea5m v\u00e0o t\u00ean \u2192 xem ph\u1ea7n \u0111i\u1ec3m danh, s\u1ebd th\u1ea5y t\u1eebng bu\u1ed5i h\u1ecdc sinh \u0111\u00f3 c\u00f3 m\u1eb7t, \u0111i tr\u1ec5 hay v\u1eafng."))

    story.append(Paragraph("<b>Gi\u00e1o vi\u00ean ch\u00ednh:</b>", style_body))
    story.append(bullet("Xem danh s\u00e1ch: h\u1ecd t\u00ean, m\u00f4n d\u1ea1y (V\u0103n/To\u00e1n), s\u1ed1 bu\u1ed5i d\u1ea1y trong th\u00e1ng, tr\u1ea1ng th\u00e1i"))
    story.append(bullet("B\u1ea5m v\u00e0o \u0111\u1ec3 xem chi ti\u1ebft th\u00f4ng tin c\u00e1 nh\u00e2n v\u00e0 b\u1ea3ng l\u01b0\u01a1ng"))

    story.append(Paragraph("<b>Tr\u1ee3 gi\u1ea3ng:</b>", style_body))
    story.append(bullet("T\u01b0\u01a1ng t\u1ef1 gi\u00e1o vi\u00ean ch\u00ednh, nh\u01b0ng hi\u1ec3n th\u1ecb s\u1ed1 gi\u1edd l\u00e0m trong th\u00e1ng thay v\u00ec s\u1ed1 bu\u1ed5i"))

    story.append(Paragraph("<b>K\u1ebf to\u00e1n:</b>", style_body))
    story.append(bullet("Xem danh s\u00e1ch k\u1ebf to\u00e1n: h\u1ecd t\u00ean, email, tr\u1ea1ng th\u00e1i"))
    story.append(bullet("C\u00f3 <b>\u00f4 t\u00ecm ki\u1ebfm</b> \u0111\u1ec3 l\u1ecdc nhanh theo t\u00ean \u1edf t\u1ea5t c\u1ea3 c\u00e1c nh\u00f3m"))

    # 1.2
    story.append(Paragraph("1.2  Qu\u1ea3n l\u00fd L\u1edbp h\u1ecdc", style_h2))
    story.append(bullet("Hi\u1ec3n th\u1ecb t\u1ea5t c\u1ea3 l\u1edbp h\u1ecdc d\u01b0\u1edbi d\u1ea1ng <b>l\u01b0\u1edbi c\u00e1c th\u1ebb</b>, m\u1ed7i th\u1ebb g\u1ed3m:"))
    story.append(sub_bullet("T\u00ean l\u1edbp (v\u00ed d\u1ee5: \"V\u0103n 6 \u2013 C\u01a1 b\u1ea3n\")"))
    story.append(sub_bullet("Nh\u00e3n m\u00f4n h\u1ecdc (V\u0103n / To\u00e1n)"))
    story.append(sub_bullet("S\u0129 s\u1ed1 hi\u1ec7n t\u1ea1i / s\u0129 s\u1ed1 t\u1ed1i \u0111a (thanh ti\u1ebfn tr\u00ecnh tr\u1ef1c quan)"))
    story.append(sub_bullet("L\u1ecbch h\u1ecdc: ng\u00e0y n\u00e0o, gi\u1edd n\u00e0o, online hay offline"))
    story.append(bullet("L\u1ecdc l\u1edbp theo tr\u00ecnh \u0111\u1ed9: T\u1ea5t c\u1ea3 / C\u01a1 b\u1ea3n / Trung b\u00ecnh / N\u00e2ng cao"))

    story.append(Paragraph("<b>B\u1ea5m v\u00e0o 1 l\u1edbp \u0111\u1ec3 xem chi ti\u1ebft v\u1edbi 4 tab:</b>", style_body))

    story.append(Paragraph("<b>Tab \u0110i\u1ec3m danh:</b>", style_body))
    story.append(bullet("Ch\u1ecdn bu\u1ed5i h\u1ecdc \u2192 xem danh s\u00e1ch h\u1ecdc sinh v\u1edbi tr\u1ea1ng th\u00e1i: C\u00f3 m\u1eb7t, \u0110i tr\u1ec5, V\u1eafng c\u00f3 ph\u00e9p, V\u1eafng kh\u00f4ng ph\u00e9p"))

    story.append(Paragraph("<b>Tab \u0110\u00e1nh gi\u00e1 &amp; Ch\u1ea5m \u0111i\u1ec3m:</b>", style_body))
    story.append(bullet("Ch\u1ecdn bu\u1ed5i h\u1ecdc \u2192 xem \u0111\u00e1nh gi\u00e1 t\u1eebng h\u1ecdc sinh"))
    story.append(sub_bullet("Bi\u1ec3u \u0111\u1ed3 m\u1ea1ng nh\u1ec7n 6 ti\u00eau ch\u00ed (m\u1ed7i ti\u00eau ch\u00ed thang 0\u201310)"))
    story.append(sub_bullet("Nh\u1eadn x\u00e9t c\u1ee7a gi\u00e1o vi\u00ean"))

    story.append(Paragraph("<b>Tab B\u00e0i gi\u1ea3ng:</b>", style_body))
    story.append(bullet("Xem danh s\u00e1ch b\u00e0i gi\u1ea3ng c\u1ee7a l\u1edbp, m\u1ed7i b\u00e0i g\u1ed3m:"))
    story.append(sub_bullet("Video b\u00e0i gi\u1ea3ng (c\u00f3 c\u00e2u h\u1ecfi tr\u1eafc nghi\u1ec7m xu\u1ea5t hi\u1ec7n gi\u1eefa video)"))
    story.append(sub_bullet("T\u00e0i li\u1ec7u \u0111\u00ednh k\u00e8m (PDF, h\u00ecnh \u1ea3nh)"))
    story.append(sub_bullet("B\u00e0i ki\u1ec3m tra t\u1ed5ng h\u1ee3p cu\u1ed1i b\u00e0i"))
    story.append(sub_bullet("B\u00e0i t\u1eadp vi\u1ebft lu\u1eadn"))
    story.append(example("V\u00ed d\u1ee5: B\u00e0i gi\u1ea3ng \"Ph\u00e2n t\u00edch nh\u00e2n v\u1eadt\" c\u00f3 2 video. Khi h\u1ecdc sinh xem video \u0111\u1ebfn ph\u00fat th\u1ee9 5, video t\u1ef1 \u0111\u1ed9ng d\u1eebng l\u1ea1i v\u00e0 hi\u1ec7n c\u00e2u h\u1ecfi tr\u1eafc nghi\u1ec7m. H\u1ecdc sinh tr\u1ea3 l\u1eddi \u0111\u00fang m\u1edbi ti\u1ebfp t\u1ee5c xem."))

    story.append(Paragraph("<b>Tab B\u00e0i t\u1eadp:</b>", style_body))
    story.append(bullet("Xem danh s\u00e1ch b\u00e0i t\u1eadp \u0111\u00e3 giao, m\u1ed7i b\u00e0i hi\u1ec3n th\u1ecb s\u1ed1 b\u00e0i \u0111\u00e3 ch\u1ea5m / ch\u1edd ch\u1ea5m / ch\u01b0a n\u1ed9p"))
    story.append(bullet("\u0110i\u1ec3m v\u00e0 nh\u1eadn x\u00e9t cho t\u1eebng b\u00e0i n\u1ed9p"))

    story.append(PageBreak())

    # 1.3
    story.append(Paragraph("1.3  B\u00e0i t\u1eadp &amp; \u0110\u1ec1 thi th\u1eed", style_h2))
    story.append(Paragraph("<b>B\u00e0i t\u1eadp:</b>", style_body))
    story.append(bullet("Danh s\u00e1ch t\u1ea5t c\u1ea3 b\u00e0i t\u1eadp \u0111\u00e3 giao \u1edf t\u1ea5t c\u1ea3 l\u1edbp"))
    story.append(bullet("M\u1ed7i b\u00e0i t\u1eadp hi\u1ec3n th\u1ecb: t\u00ean, l\u1edbp, h\u1ea1n n\u1ed9p, t\u1ed5ng \u0111i\u1ec3m, s\u1ed1 b\u00e0i \u0111\u00e3 ch\u1ea5m / ch\u1edd ch\u1ea5m / ch\u01b0a n\u1ed9p"))

    story.append(Paragraph("<b>\u0110\u1ec1 thi th\u1eed:</b>", style_body))
    story.append(bullet("Danh s\u00e1ch c\u00e1c \u0111\u1ec1 thi th\u1eed (\u0111\u00e3 thi / s\u1eafp thi)"))
    story.append(bullet("\u0110\u1ec1 \u0111\u00e3 thi \u2192 xem b\u1ea3ng x\u1ebfp h\u1ea1ng \u0111i\u1ec3m c\u1ee7a h\u1ecdc sinh"))
    story.append(example("V\u00ed d\u1ee5: \u0110\u1ec1 thi \"Ki\u1ec3m tra gi\u1eefa k\u1ef3 To\u00e1n 8\" \u0111\u00e3 ho\u00e0n th\u00e0nh \u2192 b\u1ea5m v\u00e0o s\u1ebd th\u1ea5y: H\u1ea1ng 1 \u2013 Tr\u1ea7n B (95 \u0111i\u1ec3m), H\u1ea1ng 2 \u2013 L\u00ea C (88 \u0111i\u1ec3m)..."))

    # 1.4
    story.append(Paragraph("1.4  B\u00e1o c\u00e1o", style_h2))
    story.append(Paragraph("\u0110\u00e2y l\u00e0 m\u1ee5c quan tr\u1ecdng nh\u1ea5t cho qu\u1ea3n l\u00fd, c\u00f3 <b>b\u1ed9 l\u1ecdc</b> theo l\u1edbp v\u00e0 theo th\u00e1ng, chia th\u00e0nh 4 lo\u1ea1i:", style_body))

    story.append(Paragraph("<b>B\u00e1o c\u00e1o L\u01b0\u01a1ng gi\u00e1o vi\u00ean:</b>", style_body))
    story.append(bullet("T\u1ed5ng s\u1ed1 bu\u1ed5i d\u1ea1y, t\u1ed5ng gi\u1edd d\u1ea1y, t\u1ed5ng ti\u1ec1n l\u01b0\u01a1ng th\u00e1ng \u0111\u00f3"))
    story.append(bullet("Chi ti\u1ebft t\u1eebng gi\u00e1o vi\u00ean: l\u01b0\u01a1ng c\u01a1 b\u1ea3n + ph\u1ee5 c\u1ea5p theo bu\u1ed5i = t\u1ed5ng l\u01b0\u01a1ng"))
    story.append(bullet("Tr\u1ee3 gi\u1ea3ng t\u00ednh theo gi\u1edd: \u0111\u01a1n gi\u00e1/gi\u1edd \u00d7 s\u1ed1 gi\u1edd = t\u1ed5ng l\u01b0\u01a1ng"))
    story.append(example("V\u00ed d\u1ee5: Th\u00e1ng 3/2025 \u2013 GV Nguy\u1ec5n Th\u1ecb Lan: L\u01b0\u01a1ng c\u01a1 b\u1ea3n 8.000.000\u0111 + 15 bu\u1ed5i \u00d7 200.000\u0111/bu\u1ed5i = 11.000.000\u0111"))

    story.append(Paragraph("<b>B\u00e1o c\u00e1o H\u1ecdc ph\u00ed:</b>", style_body))
    story.append(bullet("T\u1ed5ng ti\u1ec1n \u0111\u00e3 thu / ch\u01b0a thu"))
    story.append(bullet("Danh s\u00e1ch t\u1eebng ph\u1ee5 huynh: t\u00ean, s\u1ed1 Zalo, s\u1ed1 ti\u1ec1n, tr\u1ea1ng th\u00e1i (\u0111\u00e3 \u0111\u00f3ng / ch\u01b0a \u0111\u00f3ng / qu\u00e1 h\u1ea1n)"))
    story.append(bullet("N\u00fat <b>\"Nh\u1eafc qua Zalo\"</b> \u0111\u1ec3 g\u1eedi nh\u1eafc nh\u1edf ph\u1ee5 huynh ch\u01b0a \u0111\u00f3ng"))

    story.append(Paragraph("<b>B\u00e1o c\u00e1o Chuy\u00ean c\u1ea7n:</b>", style_body))
    story.append(bullet("T\u1ef7 l\u1ec7 \u0111i h\u1ecdc chung (v\u00ed d\u1ee5: 85%)"))
    story.append(bullet("S\u1ed1 bu\u1ed5i c\u00f3 m\u1eb7t / \u0111i tr\u1ec5 / v\u1eafng m\u1eb7t"))

    story.append(Paragraph("<b>B\u00e1o c\u00e1o H\u1ecdc l\u1ef1c:</b>", style_body))
    story.append(bullet("Bi\u1ec3u \u0111\u1ed3 m\u1ea1ng nh\u1ec7n th\u1ec3 hi\u1ec7n \u0111i\u1ec3m trung b\u00ecnh 6 ti\u00eau ch\u00ed \u0111\u00e1nh gi\u00e1 c\u1ee7a c\u1ea3 l\u1edbp"))
    story.append(bullet("Gi\u00fap Admin nh\u00ecn th\u1ea5y l\u1edbp n\u00e0o y\u1ebfu \u1edf ti\u00eau ch\u00ed n\u00e0o"))

    # 1.5
    story.append(Paragraph("1.5  Th\u1eddi kh\u00f3a bi\u1ec3u", style_h2))
    story.append(bullet("Hi\u1ec3n th\u1ecb <b>l\u1ecbch tu\u1ea7n</b> d\u1ea1ng b\u1ea3ng t\u1eeb 7h s\u00e1ng \u0111\u1ebfn 10h t\u1ed1i, 7 ng\u00e0y trong tu\u1ea7n"))
    story.append(bullet("M\u1ed7i \u00f4 hi\u1ec3n th\u1ecb: t\u00ean l\u1edbp, t\u00ean gi\u00e1o vi\u00ean, online/offline"))
    story.append(bullet("<b>Ph\u00e2n m\u00e0u theo gi\u00e1o vi\u00ean</b> \u0111\u1ec3 d\u1ec5 ph\u00e2n bi\u1ec7t"))
    story.append(bullet("Admin c\u00f3 th\u1ec3 <b>th\u00eam / s\u1eeda / x\u00f3a</b> l\u1ecbch h\u1ecdc"))
    story.append(bullet("C\u00f3 n\u00fat chuy\u1ec3n tu\u1ea7n (tu\u1ea7n tr\u01b0\u1edbc / tu\u1ea7n sau / h\u00f4m nay)"))
    story.append(example("V\u00ed d\u1ee5: Nh\u00ecn v\u00e0o th\u1ee9 2 l\u00fac 18:00 \u2192 th\u1ea5y \u00f4 m\u00e0u xanh \"V\u0103n 6 C\u01a1 b\u1ea3n \u2013 C\u00f4 Lan (Offline)\" \u2192 bi\u1ebft l\u00fac \u0111\u00f3 l\u1edbp n\u00e0o \u0111ang h\u1ecdc, ai d\u1ea1y, h\u1ecdc \u1edf \u0111\u00e2u."))

    # 1.6
    story.append(Paragraph("1.6  C\u1ed9ng \u0111\u1ed3ng", style_h2))
    story.append(bullet("Di\u1ec5n \u0111\u00e0n trao \u0111\u1ed5i gi\u1eefa t\u1ea5t c\u1ea3 m\u1ecdi ng\u01b0\u1eddi trong trung t\u00e2m"))
    story.append(bullet("Ai c\u0169ng c\u00f3 th\u1ec3 \u0111\u0103ng b\u00e0i vi\u1ebft, b\u00ecnh lu\u1eadn, b\u1ea5m th\u00edch"))
    story.append(bullet("B\u00e0i vi\u1ebft hi\u1ec3n th\u1ecb: t\u00ean ng\u01b0\u1eddi \u0111\u0103ng, vai tr\u00f2, th\u1eddi gian"))
    story.append(bullet("B\u00e0i quan tr\u1ecdng c\u00f3 th\u1ec3 <b>ghim l\u00ean \u0111\u1ea7u</b> (v\u00ed d\u1ee5: th\u00f4ng b\u00e1o ngh\u1ec9 l\u1ec5)"))

    # 1.7
    story.append(Paragraph("1.7  Th\u01b0 vi\u1ec7n t\u00e0i li\u1ec7u", style_h2))
    story.append(bullet("Kho t\u00e0i li\u1ec7u tham kh\u1ea3o cho h\u1ecdc sinh"))
    story.append(bullet("M\u1ed7i t\u00e0i li\u1ec7u hi\u1ec3n th\u1ecb: t\u00ean, m\u00f4n, kh\u1ed1i l\u1edbp, dung l\u01b0\u1ee3ng, s\u1ed1 l\u01b0\u1ee3t t\u1ea3i"))
    story.append(bullet("N\u00fat t\u1ea3i xu\u1ed1ng"))

    # 1.8
    story.append(Paragraph("1.8  C\u00e0i \u0111\u1eb7t", style_h2))
    story.append(bullet("Ch\u1ec9nh s\u1eeda th\u00f4ng tin trung t\u00e2m: t\u00ean, \u0111\u1ecba ch\u1ec9, s\u1ed1 \u0111i\u1ec7n tho\u1ea1i"))

    story.append(PageBreak())

    # ══════════════════  PH\u1ea6N 2: GI\u00c1O VI\u00caN  ══════════════════
    story.append(Paragraph("PH\u1ea6N 2: GI\u00c1O VI\u00caN", style_h1))
    story.append(Paragraph("Ng\u01b0\u1eddi tr\u1ef1c ti\u1ebfp gi\u1ea3ng d\u1ea1y. \u0110\u0103ng nh\u1eadp v\u00e0o s\u1ebd th\u1ea5y 4 m\u1ee5c ch\u1ee9c n\u0103ng.", style_body))
    story.append(hr())

    story.append(Paragraph("2.1  L\u1edbp c\u1ee7a t\u00f4i", style_h2))
    story.append(bullet("Ch\u1ec9 hi\u1ec3n th\u1ecb c\u00e1c l\u1edbp m\u00e0 gi\u00e1o vi\u00ean \u0111\u00f3 \u0111\u01b0\u1ee3c ph\u00e2n c\u00f4ng d\u1ea1y"))
    story.append(bullet("B\u1ea5m v\u00e0o l\u1edbp \u2192 xem chi ti\u1ebft (\u0111i\u1ec3m danh, \u0111\u00e1nh gi\u00e1, b\u00e0i gi\u1ea3ng, b\u00e0i t\u1eadp) \u2013 <b>ch\u1ec9 xem, kh\u00f4ng ch\u1ec9nh s\u1eeda</b>"))
    story.append(example("V\u00ed d\u1ee5: C\u00f4 Lan d\u1ea1y V\u0103n \u2192 \u0111\u0103ng nh\u1eadp v\u00e0o ch\u1ec9 th\u1ea5y 3 l\u1edbp V\u0103n m\u00e0 c\u00f4 d\u1ea1y, kh\u00f4ng th\u1ea5y l\u1edbp To\u00e1n c\u1ee7a th\u1ea7y kh\u00e1c."))

    story.append(Paragraph("2.2  Thu nh\u1eadp c\u1ee7a t\u00f4i", style_h2))
    story.append(bullet("Hi\u1ec3n th\u1ecb b\u1ea3ng thu nh\u1eadp th\u00e1ng hi\u1ec7n t\u1ea1i:"))
    story.append(sub_bullet("S\u1ed1 bu\u1ed5i \u0111\u00e3 d\u1ea1y (ho\u1eb7c s\u1ed1 gi\u1edd n\u1ebfu l\u00e0 tr\u1ee3 gi\u1ea3ng)"))
    story.append(sub_bullet("T\u1ed5ng l\u01b0\u01a1ng th\u00e1ng n\u00e0y"))
    story.append(example("V\u00ed d\u1ee5: Th\u00e1ng 3 \u2013 \u0110\u00e3 d\u1ea1y 15 bu\u1ed5i \u2013 Thu nh\u1eadp: 11.000.000\u0111"))

    story.append(Paragraph("2.3  Th\u1eddi kh\u00f3a bi\u1ec3u", style_h2))
    story.append(bullet("L\u1ecbch tu\u1ea7n gi\u1ed1ng Admin nh\u01b0ng <b>ch\u1ec9 hi\u1ec3n th\u1ecb l\u1ecbch c\u1ee7a gi\u00e1o vi\u00ean \u0111\u00f3</b>"))
    story.append(bullet("Ch\u1ec9 xem, kh\u00f4ng th\u1ec3 ch\u1ec9nh s\u1eeda"))

    story.append(Paragraph("2.4  C\u1ed9ng \u0111\u1ed3ng", style_h2))
    story.append(bullet("Gi\u1ed1ng ph\u1ea7n C\u1ed9ng \u0111\u1ed3ng c\u1ee7a Admin, c\u00f3 th\u1ec3 \u0111\u0103ng b\u00e0i v\u00e0 b\u00ecnh lu\u1eadn"))

    story.append(PageBreak())

    # ══════════════════  PH\u1ea6N 3: PH\u1ee4 HUYNH  ══════════════════
    story.append(Paragraph("PH\u1ea6N 3: PH\u1ee4 HUYNH", style_h1))
    story.append(Paragraph("Ng\u01b0\u1eddi theo d\u00f5i con em. \u0110\u0103ng nh\u1eadp v\u00e0o s\u1ebd th\u1ea5y 7 m\u1ee5c ch\u1ee9c n\u0103ng.", style_body))
    story.append(Paragraph("\u0110\u1eb7c bi\u1ec7t: N\u1ebfu ph\u1ee5 huynh c\u00f3 <b>nhi\u1ec1u con</b> h\u1ecdc t\u1ea1i trung t\u00e2m, \u1edf g\u00f3c tr\u00ean s\u1ebd c\u00f3 <b>\u00f4 ch\u1ecdn con</b> \u0111\u1ec3 chuy\u1ec3n \u0111\u1ed5i xem th\u00f4ng tin t\u1eebng con.", style_body))
    story.append(hr())

    story.append(Paragraph("3.1  T\u1ed5ng quan (Dashboard)", style_h2))
    story.append(Paragraph("Trang \u0111\u1ea7u ti\u00ean ph\u1ee5 huynh nh\u00ecn th\u1ea5y, t\u00f3m t\u1eaft m\u1ecdi th\u1ee9 v\u1ec1 con:", style_body))
    story.append(bullet("<b>Th\u00f4ng tin con:</b> Kh\u1ed1i l\u1edbp, tr\u00ecnh \u0111\u1ed9, ng\u00e0y sinh, danh s\u00e1ch l\u1edbp \u0111ang h\u1ecdc"))
    story.append(bullet("<b>Bi\u1ec3u \u0111\u1ed3 \u0111\u00e1nh gi\u00e1 g\u1ea7n nh\u1ea5t:</b> H\u00ecnh m\u1ea1ng nh\u1ec7n 6 ti\u00eau ch\u00ed + nh\u1eadn x\u00e9t c\u1ee7a gi\u00e1o vi\u00ean"))
    story.append(bullet("<b>T\u00ecnh tr\u1ea1ng h\u1ecdc ph\u00ed th\u00e1ng n\u00e0y:</b> S\u1ed1 ti\u1ec1n, \u0111\u00e3 \u0111\u00f3ng hay ch\u01b0a"))
    story.append(example("V\u00ed d\u1ee5: Ph\u1ee5 huynh m\u1edf app \u2192 th\u1ea5y ngay \"Con: Nguy\u1ec5n V\u0103n A \u2013 L\u1edbp 8 \u2013 Trung b\u00ecnh. \u0110\u00e1nh gi\u00e1 g\u1ea7n nh\u1ea5t: Ti\u1ebfp thu 8/10, T\u1eadp trung 7/10... H\u1ecdc ph\u00ed th\u00e1ng 3: 2.500.000\u0111 \u2013 Ch\u01b0a \u0111\u00f3ng\""))

    story.append(Paragraph("3.2  B\u00e1o c\u00e1o h\u1ecdc t\u1eadp", style_h2))
    story.append(Paragraph("Trang chi ti\u1ebft nh\u1ea5t v\u1ec1 qu\u00e1 tr\u00ecnh h\u1ecdc c\u1ee7a con:", style_body))
    story.append(bullet("N\u00fat <b>\"Xin ph\u00e9p ngh\u1ec9 h\u1ecdc\"</b>"))
    story.append(bullet("<b>3 \u00f4 th\u1ed1ng k\u00ea:</b> S\u1ed1 bu\u1ed5i c\u00f3 m\u1eb7t / \u0111i tr\u1ec5 / v\u1eafng"))
    story.append(bullet("<b>Chi ti\u1ebft t\u1eebng bu\u1ed5i h\u1ecdc:</b>"))
    story.append(sub_bullet("Ng\u00e0y, ch\u1ee7 \u0111\u1ec1 b\u00e0i h\u1ecdc, t\u00ean l\u1edbp"))
    story.append(sub_bullet("Tr\u1ea1ng th\u00e1i \u0111i\u1ec3m danh (c\u00f3 m\u1eb7t / tr\u1ec5 / v\u1eafng)"))
    story.append(sub_bullet("\u0110i\u1ec3m \u0111\u00e1nh gi\u00e1 6 ti\u00eau ch\u00ed + nh\u1eadn x\u00e9t gi\u00e1o vi\u00ean (n\u1ebfu c\u00f3)"))
    story.append(example("V\u00ed d\u1ee5: Bu\u1ed5i 10/03 \u2013 \"Ph\u00e2n t\u00edch \u0111o\u1ea1n tr\u00edch Ki\u1ec1u\" \u2013 L\u1edbp V\u0103n 8 N\u00e2ng cao \u2192 C\u00f3 m\u1eb7t \u2192 Ti\u1ebfp thu: 9, T\u1eadp trung: 8, K\u1ef9 n\u0103ng thi: 7, T\u1ef1 h\u1ecdc: 8, Ch\u0103m ch\u1ec9: 9, T\u01b0\u01a1ng t\u00e1c: 8 \u2192 GV nh\u1eadn x\u00e9t: \"B\u00e9 ti\u1ebfn b\u1ed9 r\u00f5 r\u1ec7t, c\u1ea7n luy\u1ec7n th\u00eam k\u1ef9 n\u0103ng vi\u1ebft\""))

    story.append(Paragraph("3.3  L\u1edbp h\u1ecdc c\u1ee7a con", style_h2))
    story.append(bullet("Danh s\u00e1ch c\u00e1c l\u1edbp con \u0111ang theo h\u1ecdc"))
    story.append(bullet("B\u1ea5m v\u00e0o \u2192 xem chi ti\u1ebft b\u00e0i gi\u1ea3ng, video, b\u00e0i t\u1eadp (ch\u1ec9 xem)"))
    story.append(bullet("C\u00f3 th\u1ec3 xem video b\u00e0i gi\u1ea3ng v\u00e0 l\u00e0m b\u00e0i tr\u1eafc nghi\u1ec7m trong video"))

    story.append(Paragraph("3.4  H\u1ecdc ph\u00ed", style_h2))
    story.append(bullet("Danh s\u00e1ch h\u1ecdc ph\u00ed theo t\u1eebng th\u00e1ng: th\u00e1ng, s\u1ed1 ti\u1ec1n, h\u1ea1n \u0111\u00f3ng, m\u00e3 giao d\u1ecbch, tr\u1ea1ng th\u00e1i"))
    story.append(bullet("<b>Th\u00f4ng tin chuy\u1ec3n kho\u1ea3n:</b>"))
    story.append(sub_bullet("T\u00ean ng\u00e2n h\u00e0ng, s\u1ed1 t\u00e0i kho\u1ea3n, ch\u1ee7 t\u00e0i kho\u1ea3n"))
    story.append(sub_bullet("N\u1ed9i dung chuy\u1ec3n kho\u1ea3n theo m\u1eabu (\u0111\u1ec3 trung t\u00e2m \u0111\u1ed1i so\u00e1t)"))
    story.append(example("V\u00ed d\u1ee5: Th\u00e1ng 3/2025 \u2013 2.500.000\u0111 \u2013 H\u1ea1n 15/03 \u2013 Tr\u1ea1ng th\u00e1i: Ch\u01b0a \u0111\u00f3ng. Chuy\u1ec3n kho\u1ea3n: Ng\u00e2n h\u00e0ng Vietcombank \u2013 STK 1234567890 \u2013 N\u1ed9i dung: \"HP T3 NGUYEN VAN A\""))

    story.append(Paragraph("3.5  \u0110\u1ec1 thi th\u1eed", style_h2))
    story.append(bullet("Xem c\u00e1c \u0111\u1ec1 thi th\u1eed con \u0111\u00e3 l\u00e0m ho\u1eb7c s\u1eafp thi"))
    story.append(bullet("\u0110\u1ec1 \u0111\u00e3 thi \u2192 xem <b>b\u1ea3ng x\u1ebfp h\u1ea1ng</b> \u0111i\u1ec3m s\u1ed1 so v\u1edbi c\u00e1c b\u1ea1n c\u00f9ng l\u1edbp"))
    story.append(example("V\u00ed d\u1ee5: \u0110\u1ec1 \"Ki\u1ec3m tra To\u00e1n 8 gi\u1eefa k\u1ef3\" \u2192 Con x\u1ebfp h\u1ea1ng 3/25 v\u1edbi 88 \u0111i\u1ec3m"))

    story.append(Paragraph("3.6  Th\u01b0 vi\u1ec7n t\u00e0i li\u1ec7u", style_h2))
    story.append(bullet("T\u1ea3i t\u00e0i li\u1ec7u tham kh\u1ea3o cho con"))

    story.append(Paragraph("3.7  C\u1ed9ng \u0111\u1ed3ng", style_h2))
    story.append(bullet("Tham gia di\u1ec5n \u0111\u00e0n, \u0111\u1eb7t c\u00e2u h\u1ecfi, trao \u0111\u1ed5i v\u1edbi gi\u00e1o vi\u00ean v\u00e0 admin"))

    story.append(PageBreak())

    # ══════════════════  T\u1ed4NG K\u1ebeT  ══════════════════
    story.append(Paragraph("T\u1ed4NG K\u1ebeT CH\u1ee8C N\u0102NG", style_h1))
    story.append(hr())

    # Checkbox symbols using Segoe UI Symbol font
    tick = "<font name='SegoeSymbol' color='#059669' size='12'>\u2611</font>"
    dash = "<font name='SegoeSymbol' color='#d1d5db' size='12'>\u2610</font>"

    cell_style_sum = ParagraphStyle('TDS', fontName='Arial', fontSize=8.5, textColor=DARK, alignment=TA_CENTER, leading=13)
    cell_left_sum = ParagraphStyle('TDLS', fontName='Arial', fontSize=8.5, textColor=DARK, alignment=TA_LEFT, leading=13)

    rows = [
        ["Qu\u1ea3n l\u00fd ng\u01b0\u1eddi d\u00f9ng (HS, GV, KT)", tick, dash, dash],
        ["Qu\u1ea3n l\u00fd l\u1edbp h\u1ecdc (t\u1ea1o l\u1edbp, ph\u00e2n GV)", tick, dash, dash],
        ["Xem l\u1edbp m\u00ecnh d\u1ea1y / con h\u1ecdc", f"{tick}<br/><font size='7'>t\u1ea5t c\u1ea3</font>", f"{tick}<br/><font size='7'>l\u1edbp m\u00ecnh</font>", f"{tick}<br/><font size='7'>l\u1edbp con</font>"],
        ["\u0110i\u1ec3m danh h\u1ecdc sinh", f"{tick} <font size='7'>xem</font>", f"{tick} <font size='7'>xem</font>", f"{tick} <font size='7'>xem con</font>"],
        ["\u0110\u00e1nh gi\u00e1 h\u1ecdc sinh (6 ti\u00eau ch\u00ed)", f"{tick} <font size='7'>xem</font>", f"{tick} <font size='7'>xem</font>", f"{tick} <font size='7'>xem con</font>"],
        ["B\u00e0i gi\u1ea3ng (video + tr\u1eafc nghi\u1ec7m)", tick, tick, f"{tick} <font size='7'>xem &amp; l\u00e0m</font>"],
        ["Giao &amp; ch\u1ea5m b\u00e0i t\u1eadp", tick, tick, f"{tick} <font size='7'>xem \u0111i\u1ec3m</font>"],
        ["\u0110\u1ec1 thi th\u1eed &amp; b\u1ea3ng x\u1ebfp h\u1ea1ng", tick, dash, tick],
        ["B\u00e1o c\u00e1o l\u01b0\u01a1ng gi\u00e1o vi\u00ean", tick, dash, dash],
        ["B\u00e1o c\u00e1o h\u1ecdc ph\u00ed", tick, dash, dash],
        ["B\u00e1o c\u00e1o chuy\u00ean c\u1ea7n", tick, dash, dash],
        ["B\u00e1o c\u00e1o h\u1ecdc l\u1ef1c", tick, dash, dash],
        ["Xem thu nh\u1eadp c\u00e1 nh\u00e2n", dash, tick, dash],
        ["Xem &amp; \u0111\u00f3ng h\u1ecdc ph\u00ed", dash, dash, tick],
        ["Xin ph\u00e9p ngh\u1ec9 h\u1ecdc", dash, dash, tick],
        ["Th\u1eddi kh\u00f3a bi\u1ec3u", f"{tick} <font size='7'>s\u1eeda</font>", f"{tick} <font size='7'>xem</font>", dash],
        ["C\u1ed9ng \u0111\u1ed3ng (\u0111\u0103ng b\u00e0i, b\u00ecnh lu\u1eadn)", tick, tick, tick],
        ["Th\u01b0 vi\u1ec7n t\u00e0i li\u1ec7u", tick, dash, tick],
        ["C\u00e0i \u0111\u1eb7t trung t\u00e2m", tick, dash, dash],
        ["Ch\u1ecdn xem nhi\u1ec1u con", dash, dash, tick],
    ]

    table_data = [
        [Paragraph("<b>Ch\u1ee9c n\u0103ng</b>", style_table_header),
         Paragraph("<b>Admin</b>", style_table_header),
         Paragraph("<b>Gi\u00e1o vi\u00ean</b>", style_table_header),
         Paragraph("<b>Ph\u1ee5 huynh</b>", style_table_header)]
    ]
    for row in rows:
        table_data.append([
            Paragraph(row[0], cell_left_sum),
            Paragraph(row[1], cell_style_sum),
            Paragraph(row[2], cell_style_sum),
            Paragraph(row[3], cell_style_sum),
        ])

    summary_table = Table(table_data, colWidths=[75*mm, 30*mm, 30*mm, 30*mm])
    summary_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), PRIMARY),
        ('GRID', (0, 0), (-1, -1), 0.5, BORDER),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('TOPPADDING', (0, 0), (-1, -1), 2.5*mm),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 2.5*mm),
        ('LEFTPADDING', (0, 0), (-1, -1), 2*mm),
        ('RIGHTPADDING', (0, 0), (-1, -1), 2*mm),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [WHITE, LIGHT_BG]),
    ]))
    story.append(summary_table)

    story.append(Spacer(1, 6*mm))
    story.append(HRFlowable(width="100%", thickness=0.5, color=BORDER))
    story.append(Spacer(1, 3*mm))
    story.append(Paragraph("TANOSHI VIETNAM", ParagraphStyle('Foot', fontName='Arial-Bold', fontSize=11, textColor=PRIMARY, alignment=TA_CENTER, spaceAfter=1*mm)))
    story.append(Paragraph("H\u1ec7 th\u1ed1ng qu\u1ea3n l\u00fd trung t\u00e2m gi\u00e1o d\u1ee5c", style_small))

    # Build with custom canvas for header/footer
    doc.build(story, canvasmaker=HeaderFooterCanvas)
    print(f"PDF created: {os.path.abspath(OUTPUT)}")

if __name__ == "__main__":
    build_pdf()
