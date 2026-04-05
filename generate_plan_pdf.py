# -*- coding: utf-8 -*-
import os
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.lib.colors import HexColor, white
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.enums import TA_LEFT, TA_CENTER, TA_JUSTIFY
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle,
    PageBreak, HRFlowable, KeepTogether
)
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfbase.pdfmetrics import registerFontFamily
from reportlab.pdfgen import canvas as canvasmod

# ── Fonts ─────────────────────────────────────────────────────────
FONTS_DIR = "C:/Windows/Fonts"
pdfmetrics.registerFont(TTFont("Arial", os.path.join(FONTS_DIR, "arial.ttf")))
pdfmetrics.registerFont(TTFont("Arial-Bold", os.path.join(FONTS_DIR, "arialbd.ttf")))
pdfmetrics.registerFont(TTFont("Arial-Italic", os.path.join(FONTS_DIR, "ariali.ttf")))
pdfmetrics.registerFont(TTFont("Arial-BoldItalic", os.path.join(FONTS_DIR, "arialbi.ttf")))
registerFontFamily('Arial', normal='Arial', bold='Arial-Bold', italic='Arial-Italic', boldItalic='Arial-BoldItalic')
pdfmetrics.registerFont(TTFont("SegoeSymbol", os.path.join(FONTS_DIR, "seguisym.ttf")))

# ── Colors ────────────────────────────────────────────────────────
PRIMARY = HexColor("#1a56db")
DARK = HexColor("#1f2937")
GRAY = HexColor("#6b7280")
LIGHT_BG = HexColor("#f9fafb")
LIGHT_BLUE = HexColor("#eff6ff")
BORDER = HexColor("#e5e7eb")
GREEN = HexColor("#059669")
GREEN_BG = HexColor("#ecfdf5")
ORANGE = HexColor("#d97706")
ORANGE_BG = HexColor("#fffbeb")
RED = HexColor("#dc2626")
PURPLE = HexColor("#7c3aed")
PURPLE_BG = HexColor("#f5f3ff")
WHITE = white

PAGE_W, PAGE_H = A4
LEFT_M = 20 * mm
RIGHT_M = 20 * mm
TOP_M = 28 * mm
BOTTOM_M = 22 * mm
CONTENT_W = PAGE_W - LEFT_M - RIGHT_M

# ── Styles ────────────────────────────────────────────────────────
s_h1 = ParagraphStyle('H1', fontName='Arial-Bold', fontSize=15, textColor=PRIMARY, spaceBefore=6*mm, spaceAfter=4*mm)
s_h2 = ParagraphStyle('H2', fontName='Arial-Bold', fontSize=12, textColor=DARK, spaceBefore=5*mm, spaceAfter=3*mm)
s_body = ParagraphStyle('Body', fontName='Arial', fontSize=10, textColor=DARK, leading=16, spaceAfter=2*mm, alignment=TA_JUSTIFY)
s_bullet = ParagraphStyle('Bullet', fontName='Arial', fontSize=10, textColor=DARK, leading=16, leftIndent=10*mm, bulletIndent=4*mm, spaceAfter=1.5*mm)
s_small = ParagraphStyle('Small', fontName='Arial', fontSize=9, textColor=GRAY, alignment=TA_CENTER)
s_note = ParagraphStyle('Note', fontName='Arial-Italic', fontSize=9.5, textColor=GRAY, leading=15, leftIndent=6*mm, rightIndent=6*mm, spaceBefore=2*mm, spaceAfter=3*mm, backColor=LIGHT_BG, borderPadding=(3*mm, 3*mm, 3*mm, 3*mm))

# Table styles
s_th = ParagraphStyle('TH', fontName='Arial-Bold', fontSize=9, textColor=WHITE, alignment=TA_CENTER)
s_th_left = ParagraphStyle('THL', fontName='Arial-Bold', fontSize=9, textColor=WHITE, alignment=TA_LEFT)
s_td = ParagraphStyle('TD', fontName='Arial', fontSize=9, textColor=DARK, alignment=TA_LEFT, leading=13)
s_td_center = ParagraphStyle('TDC', fontName='Arial', fontSize=9, textColor=DARK, alignment=TA_CENTER, leading=13)
s_td_bold = ParagraphStyle('TDB', fontName='Arial-Bold', fontSize=9, textColor=DARK, alignment=TA_LEFT, leading=13)

# Test milestone styles
s_test_title = ParagraphStyle('TestTitle', fontName='Arial-Bold', fontSize=10, textColor=GREEN, spaceBefore=3*mm, spaceAfter=2*mm)
s_test_bullet = ParagraphStyle('TestBullet', fontName='Arial', fontSize=9.5, textColor=DARK, leading=15, leftIndent=10*mm, bulletIndent=4*mm, spaceAfter=1*mm)

OUTPUT = "Tanoshi_Vietnam_Ke_Hoach_Trien_Khai.pdf"


# ── Header / Footer ──────────────────────────────────────────────
class HeaderFooterCanvas(canvasmod.Canvas):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._page_number = 0

    def showPage(self):
        self._page_number += 1
        self._draw_header_footer()
        super().showPage()

    def _draw_header_footer(self):
        self.saveState()
        y_line = PAGE_H - 16 * mm
        self.setStrokeColor(PRIMARY)
        self.setLineWidth(1.2)
        self.line(LEFT_M, y_line, PAGE_W - RIGHT_M, y_line)
        self.setFont("Arial-Bold", 9)
        self.setFillColor(PRIMARY)
        self.drawString(LEFT_M, y_line + 3 * mm, "TANOSHI VIETNAM")
        self.setFont("Arial", 8)
        self.setFillColor(GRAY)
        self.drawRightString(PAGE_W - RIGHT_M, y_line + 3 * mm,
                             "K\u1ebf ho\u1ea1ch tri\u1ec3n khai h\u1ec7 th\u1ed1ng")

        y_foot = 12 * mm
        self.setStrokeColor(BORDER)
        self.setLineWidth(0.5)
        self.line(LEFT_M, y_foot + 4 * mm, PAGE_W - RIGHT_M, y_foot + 4 * mm)
        self.setFont("Arial", 8)
        self.setFillColor(GRAY)
        self.drawString(LEFT_M, y_foot,
                        "Tanoshi Vietnam \u2013 K\u1ebf ho\u1ea1ch tri\u1ec3n khai h\u1ec7 th\u1ed1ng qu\u1ea3n l\u00fd trung t\u00e2m gi\u00e1o d\u1ee5c")
        self.drawRightString(PAGE_W - RIGHT_M, y_foot, f"Trang {self._page_number}")
        self.restoreState()


# ── Helpers ───────────────────────────────────────────────────────
def hr():
    return HRFlowable(width="100%", thickness=0.5, color=BORDER, spaceBefore=3*mm, spaceAfter=3*mm)

def bullet(text, style=None):
    return Paragraph(f"<bullet>&bull;</bullet> {text}", style or s_bullet)

def test_bullet(text):
    return Paragraph(f"<bullet><font name='SegoeSymbol' color='#059669'>\u2610</font></bullet> {text}", s_test_bullet)

def note(text):
    return Paragraph(text, s_note)

def make_task_table(rows, col_widths=None):
    """Create a task table. rows = list of [#, task_name, detail]"""
    if col_widths is None:
        col_widths = [10*mm, 55*mm, CONTENT_W - 65*mm]

    header = [
        Paragraph("<b>#</b>", s_th),
        Paragraph("<b>\u0110\u1ea7u vi\u1ec7c</b>", s_th_left),
        Paragraph("<b>Chi ti\u1ebft</b>", s_th_left),
    ]
    data = [header]
    for r in rows:
        data.append([
            Paragraph(str(r[0]), s_td_center),
            Paragraph(f"<b>{r[1]}</b>", s_td_bold),
            Paragraph(r[2], s_td),
        ])

    t = Table(data, colWidths=col_widths, repeatRows=1)
    t.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), PRIMARY),
        ('GRID', (0, 0), (-1, -1), 0.5, BORDER),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('TOPPADDING', (0, 0), (-1, -1), 2.5*mm),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 2.5*mm),
        ('LEFTPADDING', (0, 0), (-1, -1), 2*mm),
        ('RIGHTPADDING', (0, 0), (-1, -1), 2*mm),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [WHITE, LIGHT_BG]),
    ]))
    return t

def phase_header(num, title, color=PRIMARY):
    """Phase title bar"""
    data = [[Paragraph(f"<b>GIAI \u0110O\u1ea0N {num}: {title}</b>",
                        ParagraphStyle('PH', fontName='Arial-Bold', fontSize=11, textColor=WHITE, alignment=TA_LEFT))]]
    t = Table(data, colWidths=[CONTENT_W])
    t.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), color),
        ('TOPPADDING', (0, 0), (-1, -1), 3*mm),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 3*mm),
        ('LEFTPADDING', (0, 0), (-1, -1), 4*mm),
        ('ROUNDEDCORNERS', [2*mm, 2*mm, 2*mm, 2*mm]),
    ]))
    return t

def test_section(title, items):
    """Test milestone section"""
    elems = []
    elems.append(Paragraph(f"<font name='SegoeSymbol' color='#059669'>\u2611</font>  <b>M\u1ed1c test: {title}</b>", s_test_title))
    for item in items:
        elems.append(test_bullet(item))
    return elems


# ── Build PDF ─────────────────────────────────────────────────────
def build_pdf():
    doc = SimpleDocTemplate(
        OUTPUT, pagesize=A4,
        leftMargin=LEFT_M, rightMargin=RIGHT_M,
        topMargin=TOP_M, bottomMargin=BOTTOM_M,
        title="Tanoshi Vietnam - K\u1ebf ho\u1ea1ch tri\u1ec3n khai",
        author="Tanoshi Vietnam"
    )
    story = []

    # ══════════════════  TRANG BÌA  ══════════════════
    story.append(Spacer(1, 30*mm))
    story.append(Paragraph("TANOSHI VIETNAM", ParagraphStyle('Brand', fontName='Arial-Bold', fontSize=30, textColor=PRIMARY, alignment=TA_CENTER, spaceAfter=6*mm)))
    story.append(HRFlowable(width="40%", thickness=2, color=PRIMARY, spaceBefore=2*mm, spaceAfter=8*mm))
    story.append(Paragraph("K\u1ebe HO\u1ea0CH TRI\u1ec2N KHAI", ParagraphStyle('CT', fontName='Arial-Bold', fontSize=18, textColor=DARK, alignment=TA_CENTER, spaceAfter=3*mm)))
    story.append(Paragraph("H\u1ec6 TH\u1ed0NG QU\u1ea2N L\u00dd TRUNG T\u00c2M GI\u00c1O D\u1ee4C", ParagraphStyle('CT2', fontName='Arial-Bold', fontSize=14, textColor=DARK, alignment=TA_CENTER, spaceAfter=4*mm)))
    story.append(Paragraph("\u0110\u1ea7u vi\u1ec7c \u2013 M\u1ed1c test \u2013 Th\u1ee9 t\u1ef1 tri\u1ec3n khai", ParagraphStyle('CS', fontName='Arial', fontSize=12, textColor=GRAY, alignment=TA_CENTER, spaceAfter=20*mm)))

    # Overview table
    overview = [
        [Paragraph("<b>Giai \u0111o\u1ea1n</b>", s_th),
         Paragraph("<b>N\u1ed9i dung</b>", s_th_left),
         Paragraph("<b>S\u1ed1 \u0111\u1ea7u vi\u1ec7c</b>", s_th)],
        [Paragraph("1", s_td_center), Paragraph("N\u1ec1n m\u00f3ng h\u1ec7 th\u1ed1ng (Auth + User + Frontend)", s_td), Paragraph("9", s_td_center)],
        [Paragraph("2", s_td_center), Paragraph("Qu\u1ea3n l\u00fd l\u1edbp h\u1ecdc &amp; bu\u1ed5i h\u1ecdc", s_td), Paragraph("7", s_td_center)],
        [Paragraph("3", s_td_center), Paragraph("\u0110i\u1ec3m danh &amp; \u0111\u00e1nh gi\u00e1 h\u1ecdc sinh", s_td), Paragraph("6", s_td_center)],
        [Paragraph("4", s_td_center), Paragraph("B\u00e0i gi\u1ea3ng &amp; n\u1ed9i dung h\u1ecdc", s_td), Paragraph("7", s_td_center)],
        [Paragraph("5", s_td_center), Paragraph("B\u00e0i t\u1eadp &amp; \u0111\u1ec1 thi th\u1eed", s_td), Paragraph("6", s_td_center)],
        [Paragraph("6", s_td_center), Paragraph("H\u1ecdc ph\u00ed &amp; l\u01b0\u01a1ng gi\u00e1o vi\u00ean", s_td), Paragraph("6", s_td_center)],
        [Paragraph("7", s_td_center), Paragraph("Th\u1eddi kh\u00f3a bi\u1ec3u", s_td), Paragraph("4", s_td_center)],
        [Paragraph("8", s_td_center), Paragraph("B\u00e1o c\u00e1o &amp; Dashboard", s_td), Paragraph("6", s_td_center)],
        [Paragraph("9", s_td_center), Paragraph("C\u1ed9ng \u0111\u1ed3ng, Th\u01b0 vi\u1ec7n, C\u00e0i \u0111\u1eb7t", s_td), Paragraph("3", s_td_center)],
        [Paragraph("10", s_td_center), Paragraph("Ho\u00e0n thi\u1ec7n &amp; Go-live", s_td), Paragraph("6", s_td_center)],
        [Paragraph("", s_td_center), Paragraph("<b>T\u1ed4NG C\u1ed8NG</b>", s_td_bold), Paragraph("<b>60</b>", ParagraphStyle('TDB2', fontName='Arial-Bold', fontSize=9, textColor=DARK, alignment=TA_CENTER))],
    ]
    ov_table = Table(overview, colWidths=[18*mm, 105*mm, 25*mm])
    ov_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), PRIMARY),
        ('GRID', (0, 0), (-1, -1), 0.5, BORDER),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('TOPPADDING', (0, 0), (-1, -1), 2.5*mm),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 2.5*mm),
        ('LEFTPADDING', (0, 0), (-1, -1), 3*mm),
        ('RIGHTPADDING', (0, 0), (-1, -1), 3*mm),
        ('ROWBACKGROUNDS', (0, 1), (-1, -2), [WHITE, LIGHT_BG]),
        ('BACKGROUND', (0, -1), (-1, -1), LIGHT_BLUE),
    ]))
    story.append(ov_table)
    story.append(Spacer(1, 8*mm))
    story.append(Paragraph("Nguy\u00ean t\u1eafc: X\u00e2y t\u1eeb n\u1ec1n m\u00f3ng l\u00ean \u2013 module ph\u1ee5 thu\u1ed9c \u00edt nh\u1ea5t l\u00e0m tr\u01b0\u1edbc", s_small))
    story.append(PageBreak())

    # ══════════════════  GT1: NỀN MÓNG  ══════════════════
    story.append(phase_header(1, "N\u1ec0N M\u00d3NG H\u1ec6 TH\u1ed0NG"))
    story.append(Spacer(1, 3*mm))
    story.append(Paragraph("<b>1A \u2013 Backend &amp; Database</b>", s_h2))
    story.append(make_task_table([
        [1, "Thi\u1ebft k\u1ebf database schema", "Users (admin, teacher, assistant, accountant, parent, student), quan h\u1ec7 parent\u2013children, classes, sessions"],
        [2, "Setup backend project", "Framework, ORM, c\u1ea5u tr\u00fac th\u01b0 m\u1ee5c, environment config"],
        [3, "API x\u00e1c th\u1ef1c (Authentication)", "\u0110\u0103ng nh\u1eadp, \u0111\u0103ng xu\u1ea5t, JWT/session, ph\u00e2n quy\u1ec1n 3 role (admin/teacher/parent)"],
        [4, "API qu\u1ea3n l\u00fd ng\u01b0\u1eddi d\u00f9ng (CRUD)", "T\u1ea1o/s\u1eeda/x\u00f3a/xem: h\u1ecdc sinh, gi\u00e1o vi\u00ean, tr\u1ee3 gi\u1ea3ng, k\u1ebf to\u00e1n, ph\u1ee5 huynh"],
        [5, "Quan h\u1ec7 ph\u1ee5 huynh \u2013 h\u1ecdc sinh", "1 ph\u1ee5 huynh c\u00f3 nhi\u1ec1u con, ch\u1ecdn con \u0111\u1ec3 xem"],
    ]))
    for e in test_section("GT1-BE", [
        "\u0110\u0103ng nh\u1eadp \u0111\u00fang role \u2192 v\u00e0o \u0111\u00fang giao di\u1ec7n",
        "\u0110\u0103ng nh\u1eadp sai \u2192 b\u00e1o l\u1ed7i, kh\u00f4ng cho v\u00e0o",
        "CRUD ng\u01b0\u1eddi d\u00f9ng \u0111\u1ea7y \u0111\u1ee7, kh\u00f4ng b\u1ecb tr\u00f9ng d\u1eef li\u1ec7u",
        "Ph\u1ee5 huynh c\u00f3 2 con \u2192 chuy\u1ec3n \u0111\u1ed5i xem \u0111\u01b0\u1ee3c c\u1ea3 2",
    ]):
        story.append(e)

    story.append(Paragraph("<b>1B \u2013 Frontend n\u1ec1n t\u1ea3ng</b>", s_h2))
    story.append(make_task_table([
        [6, "Layout 3 role", "Sidebar + header cho Admin, Teacher, Parent"],
        [7, "Trang \u0111\u0103ng nh\u1eadp", "Form \u0111\u0103ng nh\u1eadp th\u1eadt (thay th\u1ebf ch\u1ecdn role hi\u1ec7n t\u1ea1i)"],
        [8, "Routing &amp; b\u1ea3o v\u1ec7 \u0111\u01b0\u1eddng d\u1eabn", "Ch\u1eb7n truy c\u1eadp sai role, redirect khi ch\u01b0a \u0111\u0103ng nh\u1eadp"],
        [9, "K\u1ebft n\u1ed1i frontend \u2194 backend", "Thay mock data b\u1eb1ng API th\u1eadt, x\u1eed l\u00fd loading/error"],
    ]))
    for e in test_section("GT1-FE", [
        "\u0110\u0103ng nh\u1eadp \u2192 hi\u1ec3n th\u1ecb \u0111\u00fang layout theo role",
        "Truy c\u1eadp URL admin khi l\u00e0 teacher \u2192 b\u1ecb ch\u1eb7n",
        "M\u1ea5t m\u1ea1ng / API l\u1ed7i \u2192 hi\u1ec3n th\u1ecb th\u00f4ng b\u00e1o, kh\u00f4ng crash",
    ]):
        story.append(e)

    story.append(PageBreak())

    # ══════════════════  GT2: LỚP HỌC  ══════════════════
    story.append(phase_header(2, "QU\u1ea2N L\u00dd L\u1edaP H\u1eccC"))
    story.append(Spacer(1, 3*mm))
    story.append(make_task_table([
        [10, "API &amp; UI qu\u1ea3n l\u00fd l\u1edbp h\u1ecdc", "T\u1ea1o l\u1edbp, g\u00e1n GV ch\u00ednh + tr\u1ee3 gi\u1ea3ng, set s\u0129 s\u1ed1 t\u1ed1i \u0111a, ch\u1ecdn m\u00f4n/kh\u1ed1i/tr\u00ecnh \u0111\u1ed9"],
        [11, "G\u00e1n h\u1ecdc sinh v\u00e0o l\u1edbp", "Th\u00eam/x\u00f3a h\u1ecdc sinh kh\u1ecfi l\u1edbp, ki\u1ec3m tra s\u0129 s\u1ed1 t\u1ed1i \u0111a"],
        [12, "Qu\u1ea3n l\u00fd l\u1ecbch h\u1ecdc c\u1ee7a l\u1edbp", "L\u1ecbch c\u1ed1 \u0111\u1ecbnh (th\u1ee9 m\u1ea5y, gi\u1edd n\u00e0o), lo\u1ea1i h\u00ecnh (online/offline), link Zoom"],
        [13, "Qu\u1ea3n l\u00fd bu\u1ed5i h\u1ecdc (Session)", "T\u1ea1o bu\u1ed5i h\u1ecdc t\u1eeb l\u1ecbch c\u1ed1 \u0111\u1ecbnh, tr\u1ea1ng th\u00e1i (s\u1eafp t\u1edbi/ho\u00e0n th\u00e0nh/h\u1ee7y)"],
        [14, "L\u1ecdc l\u1edbp theo tr\u00ecnh \u0111\u1ed9", "Tab filter: T\u1ea5t c\u1ea3 / C\u01a1 b\u1ea3n / Trung b\u00ecnh / N\u00e2ng cao"],
        [15, "GV xem l\u1edbp m\u00ecnh d\u1ea1y", "L\u1ecdc ch\u1ec9 l\u1edbp m\u00e0 GV \u0111\u00f3 l\u00e0 gi\u00e1o vi\u00ean ch\u00ednh ho\u1eb7c tr\u1ee3 gi\u1ea3ng"],
        [16, "PH xem l\u1edbp con h\u1ecdc", "L\u1ecdc ch\u1ec9 l\u1edbp m\u00e0 con c\u1ee7a PH \u0111ang theo h\u1ecdc"],
    ]))
    for e in test_section("GT2", [
        "T\u1ea1o l\u1edbp \u2192 g\u00e1n GV \u2192 th\u00eam HS \u2192 hi\u1ec3n th\u1ecb \u0111\u00fang s\u0129 s\u1ed1",
        "Th\u00eam HS v\u01b0\u1ee3t s\u0129 s\u1ed1 \u2192 b\u00e1o l\u1ed7i",
        "GV Lan \u0111\u0103ng nh\u1eadp \u2192 ch\u1ec9 th\u1ea5y l\u1edbp c\u1ee7a m\u00ecnh",
        "PH \u0111\u0103ng nh\u1eadp \u2192 ch\u1ec9 th\u1ea5y l\u1edbp con \u0111ang h\u1ecdc",
        "T\u1ea1o bu\u1ed5i h\u1ecdc \u2192 hi\u1ec3n th\u1ecb \u0111\u00fang tr\u00ean l\u1ecbch",
    ]):
        story.append(e)

    story.append(PageBreak())

    # ══════════════════  GT3: ĐIỂM DANH  ══════════════════
    story.append(phase_header(3, "\u0110I\u1ec2M DANH & \u0110\u00c1NH GI\u00c1"))
    story.append(Spacer(1, 3*mm))
    story.append(make_task_table([
        [17, "API &amp; UI \u0111i\u1ec3m danh", "GV \u0111i\u1ec3m danh theo bu\u1ed5i: c\u00f3 m\u1eb7t / \u0111i tr\u1ec5 / v\u1eafng c\u00f3 ph\u00e9p / v\u1eafng kh\u00f4ng ph\u00e9p, ghi ch\u00fa"],
        [18, "Admin xem \u0111i\u1ec3m danh", "Xem \u0111i\u1ec3m danh t\u1ea5t c\u1ea3 l\u1edbp (ch\u1ec9 xem, kh\u00f4ng s\u1eeda)"],
        [19, "PH xem \u0111i\u1ec3m danh con", "Ch\u1ec9 th\u1ea5y d\u00f2ng c\u1ee7a con m\u00ecnh trong l\u1edbp"],
        [20, "API &amp; UI \u0111\u00e1nh gi\u00e1 h\u1ecdc sinh", "GV ch\u1ea5m 6 ti\u00eau ch\u00ed (0\u201310): Ti\u1ebfp thu, T\u1eadp trung, K\u1ef9 n\u0103ng thi, T\u1ef1 h\u1ecdc, Ch\u0103m ch\u1ec9, T\u01b0\u01a1ng t\u00e1c + nh\u1eadn x\u00e9t"],
        [21, "Bi\u1ec3u \u0111\u1ed3 m\u1ea1ng nh\u1ec7n (Radar)", "Hi\u1ec3n th\u1ecb 6 ti\u00eau ch\u00ed d\u1ea1ng bi\u1ec3u \u0111\u1ed3 tr\u1ef1c quan"],
        [22, "PH xin ph\u00e9p ngh\u1ec9 h\u1ecdc", "PH g\u1eedi y\u00eau c\u1ea7u ngh\u1ec9 \u2192 GV/Admin nh\u1eadn \u0111\u01b0\u1ee3c"],
    ]))
    for e in test_section("GT3", [
        "GV \u0111i\u1ec3m danh 1 bu\u1ed5i \u2192 Admin v\u00e0 PH xem \u0111\u01b0\u1ee3c \u0111\u00fang",
        "GV \u0111\u00e1nh gi\u00e1 HS \u2192 bi\u1ec3u \u0111\u1ed3 m\u1ea1ng nh\u1ec7n hi\u1ec3n th\u1ecb \u0111\u00fang 6 tr\u1ee5c",
        "PH xem \u2192 ch\u1ec9 th\u1ea5y \u0111\u00e1nh gi\u00e1 con m\u00ecnh, kh\u00f4ng th\u1ea5y HS kh\u00e1c",
        "PH xin ngh\u1ec9 \u2192 tr\u1ea1ng th\u00e1i hi\u1ec3n th\u1ecb \"v\u1eafng c\u00f3 ph\u00e9p\"",
        "Bu\u1ed5i ch\u01b0a \u0111i\u1ec3m danh \u2192 hi\u1ec3n th\u1ecb \"ch\u01b0a c\u00f3 d\u1eef li\u1ec7u\"",
    ]):
        story.append(e)

    # ══════════════════  GT4: BÀI GIẢNG  ══════════════════
    story.append(Spacer(1, 4*mm))
    story.append(phase_header(4, "B\u00c0I GI\u1ea2NG & N\u1ed8I DUNG H\u1eccC"))
    story.append(Spacer(1, 3*mm))
    story.append(make_task_table([
        [23, "API &amp; UI qu\u1ea3n l\u00fd b\u00e0i gi\u1ea3ng", "T\u1ea1o b\u00e0i gi\u1ea3ng, g\u00e1n v\u00e0o l\u1edbp, s\u1eafp x\u1ebfp th\u1ee9 t\u1ef1, tr\u1ea1ng th\u00e1i (nh\u00e1p/xu\u1ea5t b\u1ea3n)"],
        [24, "Upload &amp; ph\u00e1t video", "Upload video b\u00e0i gi\u1ea3ng, player xem video"],
        [25, "Tr\u1eafc nghi\u1ec7m trong video", "T\u1ea1o c\u00e2u h\u1ecfi t\u1ea1i m\u1ed1c th\u1eddi gian, video d\u1eebng \u2192 hi\u1ec7n quiz \u2192 tr\u1ea3 l\u1eddi \u2192 ti\u1ebfp t\u1ee5c"],
        [26, "T\u00e0i li\u1ec7u \u0111\u00ednh k\u00e8m", "Upload/download PDF, h\u00ecnh \u1ea3nh \u0111\u00ednh k\u00e8m b\u00e0i gi\u1ea3ng"],
        [27, "B\u00e0i ki\u1ec3m tra t\u1ed5ng h\u1ee3p", "Quiz cu\u1ed1i b\u00e0i gi\u1ea3ng, nhi\u1ec1u c\u00e2u h\u1ecfi tr\u1eafc nghi\u1ec7m"],
        [28, "B\u00e0i t\u1eadp vi\u1ebft lu\u1eadn", "T\u1ea1o \u0111\u1ec1 b\u00e0i vi\u1ebft lu\u1eadn, HS n\u1ed9p b\u00e0i d\u1ea1ng text/\u1ea3nh"],
        [29, "Li\u00ean k\u1ebft b\u00e0i gi\u1ea3ng \u2194 bu\u1ed5i h\u1ecdc", "G\u00e1n b\u00e0i gi\u1ea3ng v\u00e0o bu\u1ed5i h\u1ecdc c\u1ee5 th\u1ec3"],
    ]))
    for e in test_section("GT4", [
        "T\u1ea1o b\u00e0i gi\u1ea3ng v\u1edbi 2 video + 3 quiz \u2192 HS xem \u2192 \u0111\u1ebfn ph\u00fat 5 d\u1eebng \u2192 hi\u1ec7n quiz \u2192 \u0111\u00fang \u2192 ch\u1ea1y ti\u1ebfp",
        "Tr\u1ea3 l\u1eddi sai \u2192 th\u00f4ng b\u00e1o sai, cho l\u00e0m l\u1ea1i",
        "Upload PDF \u2192 PH t\u1ea3i v\u1ec1 \u0111\u01b0\u1ee3c \u0111\u00fang file",
        "B\u00e0i gi\u1ea3ng \"b\u1ea3n nh\u00e1p\" \u2192 HS/PH kh\u00f4ng th\u1ea5y",
    ]):
        story.append(e)

    story.append(PageBreak())

    # ══════════════════  GT5: BÀI TẬP  ══════════════════
    story.append(phase_header(5, "B\u00c0I T\u1eacP & \u0110\u1ec0 THI TH\u1eed"))
    story.append(Spacer(1, 3*mm))
    story.append(make_task_table([
        [30, "API &amp; UI giao b\u00e0i t\u1eadp", "T\u1ea1o b\u00e0i t\u1eadp: t\u00ean, h\u1ea1n n\u1ed9p, t\u1ed5ng \u0111i\u1ec3m, lo\u1ea1i n\u1ed9p (text/upload \u1ea3nh)"],
        [31, "HS n\u1ed9p b\u00e0i t\u1eadp", "N\u1ed9p d\u1ea1ng text ho\u1eb7c ch\u1ee5p \u1ea3nh upload"],
        [32, "GV ch\u1ea5m b\u00e0i t\u1eadp", "Ch\u1ea5m \u0111i\u1ec3m + nh\u1eadn x\u00e9t t\u1eebng b\u00e0i n\u1ed9p"],
        [33, "Th\u1ed1ng k\u00ea n\u1ed9p b\u00e0i", "\u0110\u1ebfm: \u0111\u00e3 ch\u1ea5m / ch\u1edd ch\u1ea5m / ch\u01b0a n\u1ed9p"],
        [34, "API &amp; UI \u0111\u1ec1 thi th\u1eed", "T\u1ea1o \u0111\u1ec1 thi: t\u00ean, m\u00f4n, th\u1eddi gian, t\u1ed5ng \u0111i\u1ec3m"],
        [35, "B\u1ea3ng x\u1ebfp h\u1ea1ng \u0111\u1ec1 thi", "X\u1ebfp h\u1ea1ng theo \u0111i\u1ec3m, hi\u1ec3n th\u1ecb cho PH"],
    ]))
    for e in test_section("GT5", [
        "GV giao b\u00e0i \u2192 HS n\u1ed9p \u2192 GV ch\u1ea5m \u2192 PH xem \u0111\u01b0\u1ee3c \u0111i\u1ec3m + nh\u1eadn x\u00e9t",
        "Qu\u00e1 h\u1ea1n n\u1ed9p \u2192 hi\u1ec3n th\u1ecb \u0111\u00fang tr\u1ea1ng th\u00e1i",
        "\u0110\u1ec1 thi 25 HS \u2192 b\u1ea3ng x\u1ebfp h\u1ea1ng \u0111\u00fang th\u1ee9 t\u1ef1 \u0111i\u1ec3m gi\u1ea3m d\u1ea7n",
        "Admin xem t\u1ed5ng quan \u2192 th\u1ea5y \u0111\u00fang s\u1ed1 li\u1ec7u th\u1ed1ng k\u00ea",
    ]):
        story.append(e)

    # ══════════════════  GT6: HỌC PHÍ & LƯƠNG  ══════════════════
    story.append(Spacer(1, 4*mm))
    story.append(phase_header(6, "H\u1eccC PH\u00cd & L\u01af\u01a0NG GI\u00c1O VI\u00caN"))
    story.append(Spacer(1, 3*mm))
    story.append(make_task_table([
        [36, "API &amp; UI qu\u1ea3n l\u00fd h\u1ecdc ph\u00ed", "T\u1ea1o phi\u1ebfu thu theo th\u00e1ng, s\u1ed1 ti\u1ec1n, h\u1ea1n \u0111\u00f3ng, tr\u1ea1ng th\u00e1i"],
        [37, "PH xem &amp; \u0111\u1ed1i so\u00e1t h\u1ecdc ph\u00ed", "Danh s\u00e1ch theo th\u00e1ng + th\u00f4ng tin chuy\u1ec3n kho\u1ea3n (ng\u00e2n h\u00e0ng, STK, n\u1ed9i dung m\u1eabu)"],
        [38, "Admin c\u1eadp nh\u1eadt tr\u1ea1ng th\u00e1i", "X\u00e1c nh\u1eadn \u0111\u00e3 thu ti\u1ec1n, c\u1eadp nh\u1eadt m\u00e3 giao d\u1ecbch"],
        [39, "Nh\u1eafc h\u1ecdc ph\u00ed qua Zalo", "N\u00fat b\u1ea5m m\u1edf link Zalo nh\u1eafc PH ch\u01b0a \u0111\u00f3ng"],
        [40, "API &amp; UI t\u00ednh l\u01b0\u01a1ng GV", "GV ch\u00ednh: l\u01b0\u01a1ng c\u01a1 b\u1ea3n + ph\u1ee5 c\u1ea5p/bu\u1ed5i. Tr\u1ee3 gi\u1ea3ng: \u0111\u01a1n gi\u00e1/gi\u1edd \u00d7 s\u1ed1 gi\u1edd"],
        [41, "GV xem thu nh\u1eadp c\u00e1 nh\u00e2n", "Trang \"Thu nh\u1eadp c\u1ee7a t\u00f4i\" hi\u1ec3n th\u1ecb l\u01b0\u01a1ng th\u00e1ng hi\u1ec7n t\u1ea1i"],
    ]))
    for e in test_section("GT6", [
        "T\u1ea1o phi\u1ebfu thu \u2192 PH th\u1ea5y \"ch\u01b0a \u0111\u00f3ng\" \u2192 Admin x\u00e1c nh\u1eadn \u2192 PH th\u1ea5y \"\u0111\u00e3 \u0111\u00f3ng\"",
        "Qu\u00e1 h\u1ea1n \u2192 t\u1ef1 \u0111\u1ed9ng chuy\u1ec3n sang \"qu\u00e1 h\u1ea1n\" (\u0111\u1ecf)",
        "L\u01b0\u01a1ng GV: 15 bu\u1ed5i \u00d7 200.000\u0111 + 8 tri\u1ec7u = 11 tri\u1ec7u \u2192 hi\u1ec3n th\u1ecb \u0111\u00fang",
        "Tr\u1ee3 gi\u1ea3ng: 40 gi\u1edd \u00d7 80.000\u0111 = 3.200.000\u0111 \u2192 \u0111\u00fang",
        "GV \u0111\u0103ng nh\u1eadp \u2192 th\u1ea5y \u0111\u00fang l\u01b0\u01a1ng c\u1ee7a m\u00ecnh, kh\u00f4ng th\u1ea5y c\u1ee7a ng\u01b0\u1eddi kh\u00e1c",
    ]):
        story.append(e)

    story.append(PageBreak())

    # ══════════════════  GT7: THỜI KHÓA BIỂU  ══════════════════
    story.append(phase_header(7, "TH\u1edcI KH\u00d3A BI\u1ec2U"))
    story.append(Spacer(1, 3*mm))
    story.append(make_task_table([
        [42, "API l\u1ecbch tu\u1ea7n", "L\u1ea5y danh s\u00e1ch s\u1ef1 ki\u1ec7n theo tu\u1ea7n, ph\u00e2n m\u00e0u theo GV"],
        [43, "UI l\u1ecbch tu\u1ea7n d\u1ea1ng b\u1ea3ng", "Grid 7h\u201322h \u00d7 7 ng\u00e0y, n\u00fat chuy\u1ec3n tu\u1ea7n"],
        [44, "Admin th\u00eam/s\u1eeda/x\u00f3a l\u1ecbch", "B\u1ea5m \u00f4 tr\u1ed1ng \u2192 th\u00eam, b\u1ea5m s\u1ef1 ki\u1ec7n \u2192 s\u1eeda/x\u00f3a"],
        [45, "GV xem l\u1ecbch c\u00e1 nh\u00e2n", "L\u1ecdc ch\u1ec9 l\u1ecbch c\u1ee7a GV \u0111\u00f3, kh\u00f4ng s\u1eeda \u0111\u01b0\u1ee3c"],
    ]))
    for e in test_section("GT7", [
        "Admin th\u00eam l\u1ecbch th\u1ee9 2, 18:00 \"V\u0103n 6\" \u2192 hi\u1ec7n \u0111\u00fang v\u1ecb tr\u00ed tr\u00ean b\u1ea3ng",
        "Chuy\u1ec3n tu\u1ea7n tr\u01b0\u1edbc/sau \u2192 d\u1eef li\u1ec7u \u0111\u1ed5i \u0111\u00fang",
        "GV Lan xem \u2192 ch\u1ec9 th\u1ea5y l\u1edbp m\u00ecnh d\u1ea1y",
        "2 l\u1edbp c\u00f9ng gi\u1edd, kh\u00e1c GV \u2192 hi\u1ec3n th\u1ecb c\u1ea3 2, kh\u00e1c m\u00e0u",
    ]):
        story.append(e)

    # ══════════════════  GT8: BÁO CÁO  ══════════════════
    story.append(Spacer(1, 4*mm))
    story.append(phase_header(8, "B\u00c1O C\u00c1O & DASHBOARD"))
    story.append(Spacer(1, 3*mm))
    story.append(make_task_table([
        [46, "Dashboard ph\u1ee5 huynh", "T\u1ed5ng h\u1ee3p: info con + \u0111\u00e1nh gi\u00e1 g\u1ea7n nh\u1ea5t (radar) + h\u1ecdc ph\u00ed th\u00e1ng n\u00e0y"],
        [47, "B\u00e1o c\u00e1o l\u01b0\u01a1ng GV (Admin)", "L\u1ecdc theo th\u00e1ng, t\u1ed5ng h\u1ee3p l\u01b0\u01a1ng t\u1ea5t c\u1ea3 GV"],
        [48, "B\u00e1o c\u00e1o h\u1ecdc ph\u00ed (Admin)", "L\u1ecdc theo l\u1edbp/th\u00e1ng, t\u1ed5ng thu/ch\u01b0a thu, danh s\u00e1ch chi ti\u1ebft"],
        [49, "B\u00e1o c\u00e1o chuy\u00ean c\u1ea7n (Admin)", "T\u1ef7 l\u1ec7 \u0111i h\u1ecdc, th\u1ed1ng k\u00ea c\u00f3 m\u1eb7t/tr\u1ec5/v\u1eafng theo l\u1edbp/th\u00e1ng"],
        [50, "B\u00e1o c\u00e1o h\u1ecdc l\u1ef1c (Admin)", "Radar chart trung b\u00ecnh 6 ti\u00eau ch\u00ed c\u1ee7a c\u1ea3 l\u1edbp"],
        [51, "B\u00e1o c\u00e1o h\u1ecdc t\u1eadp (PH)", "Chi ti\u1ebft t\u1eebng bu\u1ed5i: \u0111i\u1ec3m danh + \u0111\u00e1nh gi\u00e1 + nh\u1eadn x\u00e9t"],
    ]))
    for e in test_section("GT8", [
        "PH dashboard \u2192 hi\u1ec3n th\u1ecb \u0111\u00fang th\u00f4ng tin con \u0111ang ch\u1ecdn, \u0111\u1ed5i con \u2192 data \u0111\u1ed5i theo",
        "B\u00e1o c\u00e1o l\u01b0\u01a1ng th\u00e1ng 3 \u2192 t\u1ed5ng s\u1ed1 kh\u1edbp v\u1edbi chi ti\u1ebft t\u1eebng GV",
        "B\u00e1o c\u00e1o h\u1ecdc ph\u00ed \u2192 t\u1ed5ng \u0111\u00e3 thu + ch\u01b0a thu = t\u1ed5ng ph\u00e1t sinh",
        "L\u1edbp 20 HS, 10 bu\u1ed5i \u2192 t\u1ef7 l\u1ec7 chuy\u00ean c\u1ea7n t\u00ednh \u0111\u00fang %",
        "Radar chart \u2192 6 tr\u1ee5c hi\u1ec3n th\u1ecb \u0111\u00fang gi\u00e1 tr\u1ecb trung b\u00ecnh",
    ]):
        story.append(e)

    story.append(PageBreak())

    # ══════════════════  GT9: CỘNG ĐỒNG  ══════════════════
    story.append(phase_header(9, "C\u1ed8NG \u0110\u1ed2NG, TH\u01af VI\u1ec6N & C\u00c0I \u0110\u1eb6T"))
    story.append(Spacer(1, 3*mm))
    story.append(make_task_table([
        [52, "API &amp; UI c\u1ed9ng \u0111\u1ed3ng", "\u0110\u0103ng b\u00e0i, b\u00ecnh lu\u1eadn, th\u00edch, ghim b\u00e0i, badge vai tr\u00f2"],
        [53, "API &amp; UI th\u01b0 vi\u1ec7n t\u00e0i li\u1ec7u", "Upload/download t\u00e0i li\u1ec7u, ph\u00e2n lo\u1ea1i theo m\u00f4n/kh\u1ed1i"],
        [54, "C\u00e0i \u0111\u1eb7t trung t\u00e2m", "S\u1eeda t\u00ean, \u0111\u1ecba ch\u1ec9, S\u0110T trung t\u00e2m"],
    ]))
    for e in test_section("GT9", [
        "GV \u0111\u0103ng b\u00e0i \u2192 PH th\u1ea5y, b\u00ecnh lu\u1eadn \u2192 GV th\u1ea5y reply",
        "Admin ghim b\u00e0i \u2192 hi\u1ec7n \u0111\u1ea7u ti\u00ean cho t\u1ea5t c\u1ea3",
        "Upload t\u00e0i li\u1ec7u 5MB \u2192 t\u1ea3i v\u1ec1 \u0111\u00fang file",
        "S\u1eeda t\u00ean trung t\u00e2m \u2192 header c\u1eadp nh\u1eadt",
    ]):
        story.append(e)

    # ══════════════════  GT10: HOÀN THIỆN  ══════════════════
    story.append(Spacer(1, 4*mm))
    story.append(phase_header(10, "HO\u00c0N THI\u1ec6N & GO-LIVE", RED))
    story.append(Spacer(1, 3*mm))
    story.append(make_task_table([
        [55, "Responsive mobile", "Test tr\u00ean \u0111i\u1ec7n tho\u1ea1i, tablet, \u0111\u1ea3m b\u1ea3o sidebar collapse \u0111\u00fang"],
        [56, "T\u1ed1i \u01b0u hi\u1ec7u n\u0103ng", "Lazy loading, ph\u00e2n trang danh s\u00e1ch d\u00e0i, cache API"],
        [57, "B\u1ea3o m\u1eadt", "Validate input, ch\u1ed1ng XSS/SQL injection, rate limiting, HTTPS"],
        [58, "UAT (User Acceptance Test)", "Cho Admin/GV/PH th\u1eadt d\u00f9ng th\u1eed, ghi nh\u1eadn feedback"],
        [59, "S\u1eeda bug t\u1eeb UAT", "Fix c\u00e1c l\u1ed7i ph\u00e1t sinh t\u1eeb test th\u1ef1c t\u1ebf"],
        [60, "Deploy production", "Deploy l\u00ean server ch\u00ednh th\u1ee9c, c\u1ea5u h\u00ecnh domain"],
    ]))
    for e in test_section("GT10 \u2013 Final", [
        "Lu\u1ed3ng end-to-end: Admin t\u1ea1o l\u1edbp \u2192 g\u00e1n GV \u2192 th\u00eam HS \u2192 GV \u0111i\u1ec3m danh \u2192 \u0111\u00e1nh gi\u00e1 \u2192 PH xem dashboard \u2192 \u0111\u00f3ng h\u1ecdc ph\u00ed \u2192 Admin xem b\u00e1o c\u00e1o \u2192 ch\u1ea1y m\u01b0\u1ee3t",
        "Test tr\u00ean Chrome, Safari, Firefox + 3 k\u00edch th\u01b0\u1edbc m\u00e0n h\u00ecnh",
        "50 user \u0111\u1ed3ng th\u1eddi \u2192 h\u1ec7 th\u1ed1ng kh\u00f4ng lag",
    ]):
        story.append(e)

    story.append(PageBreak())

    # ══════════════════  SƠ ĐỒ PHỤ THUỘC  ══════════════════
    story.append(Paragraph("S\u01a0 \u0110\u1ed2 PH\u1ee4 THU\u1ed8C GI\u1eeeA C\u00c1C GIAI \u0110O\u1ea0N", s_h1))
    story.append(hr())

    story.append(Spacer(1, 4*mm))

    # Draw dependency diagram as a styled table
    dep_style = ParagraphStyle('Dep', fontName='Arial', fontSize=9.5, textColor=DARK, leading=14, alignment=TA_LEFT)
    dep_bold = ParagraphStyle('DepB', fontName='Arial-Bold', fontSize=9.5, textColor=PRIMARY, leading=14, alignment=TA_LEFT)
    dep_note = ParagraphStyle('DepN', fontName='Arial-Italic', fontSize=9, textColor=GRAY, leading=13, alignment=TA_LEFT)

    deps = [
        ["GT1", "N\u1ec1n m\u00f3ng (Auth + User)", "Kh\u00f4ng ph\u1ee5 thu\u1ed9c", "B\u1eaft bu\u1ed9c l\u00e0m \u0111\u1ea7u ti\u00ean"],
        ["GT2", "L\u1edbp h\u1ecdc &amp; Bu\u1ed5i h\u1ecdc", "C\u1ea7n GT1", "N\u1ec1n t\u1ea3ng cho GT3\u2013GT8"],
        ["GT3", "\u0110i\u1ec3m danh &amp; \u0110\u00e1nh gi\u00e1", "C\u1ea7n GT2", ""],
        ["GT4", "B\u00e0i gi\u1ea3ng &amp; Video", "C\u1ea7n GT2", "C\u00f3 th\u1ec3 l\u00e0m song song GT3"],
        ["GT5", "B\u00e0i t\u1eadp &amp; \u0110\u1ec1 thi", "C\u1ea7n GT2, GT4", ""],
        ["GT6", "H\u1ecdc ph\u00ed &amp; L\u01b0\u01a1ng", "C\u1ea7n GT1, GT2", "C\u00f3 th\u1ec3 l\u00e0m song song GT3\u2013GT5"],
        ["GT7", "Th\u1eddi kh\u00f3a bi\u1ec3u", "C\u1ea7n GT2", "\u0110\u1ed9c l\u1eadp, l\u00e0m b\u1ea5t k\u1ef3 l\u00fac n\u00e0o sau GT2"],
        ["GT8", "B\u00e1o c\u00e1o &amp; Dashboard", "C\u1ea7n GT3\u2013GT6", "L\u00e0m sau c\u00f9ng trong nh\u00f3m nghi\u1ec7p v\u1ee5"],
        ["GT9", "C\u1ed9ng \u0111\u1ed3ng, Th\u01b0 vi\u1ec7n", "\u0110\u1ed9c l\u1eadp", "C\u00f3 th\u1ec3 l\u00e0m song song b\u1ea5t k\u1ef3 giai \u0111o\u1ea1n"],
        ["GT10", "Ho\u00e0n thi\u1ec7n &amp; Go-live", "C\u1ea7n t\u1ea5t c\u1ea3", "Giai \u0111o\u1ea1n cu\u1ed1i c\u00f9ng"],
    ]

    dep_header = [
        Paragraph("<b>Giai \u0111o\u1ea1n</b>", s_th),
        Paragraph("<b>N\u1ed9i dung</b>", s_th_left),
        Paragraph("<b>Ph\u1ee5 thu\u1ed9c</b>", s_th_left),
        Paragraph("<b>Ghi ch\u00fa</b>", s_th_left),
    ]
    dep_data = [dep_header]
    for d in deps:
        dep_data.append([
            Paragraph(f"<b>{d[0]}</b>", ParagraphStyle('DP', fontName='Arial-Bold', fontSize=9, textColor=PRIMARY, alignment=TA_CENTER)),
            Paragraph(d[1], s_td),
            Paragraph(d[2], s_td),
            Paragraph(d[3], dep_note),
        ])

    dep_table = Table(dep_data, colWidths=[18*mm, 52*mm, 38*mm, CONTENT_W - 108*mm])
    dep_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), PRIMARY),
        ('GRID', (0, 0), (-1, -1), 0.5, BORDER),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('TOPPADDING', (0, 0), (-1, -1), 2.5*mm),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 2.5*mm),
        ('LEFTPADDING', (0, 0), (-1, -1), 2*mm),
        ('RIGHTPADDING', (0, 0), (-1, -1), 2*mm),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [WHITE, LIGHT_BG]),
    ]))
    story.append(dep_table)

    story.append(Spacer(1, 5*mm))
    story.append(note("<b>L\u01b0u \u00fd quan tr\u1ecdng:</b> GT7 (Th\u1eddi kh\u00f3a bi\u1ec3u) v\u00e0 GT9 (C\u1ed9ng \u0111\u1ed3ng, Th\u01b0 vi\u1ec7n) \u0111\u1ed9c l\u1eadp v\u1edbi GT3\u2013GT6, c\u00f3 th\u1ec3 l\u00e0m song song n\u1ebfu c\u00f3 \u0111\u1ee7 nh\u00e2n l\u1ef1c. \u0110\u00e2y l\u00e0 c\u01a1 h\u1ed9i t\u1ed1t \u0111\u1ec3 t\u0103ng t\u1ed1c ti\u1ebfn \u0111\u1ed9 d\u1ef1 \u00e1n."))

    story.append(Spacer(1, 6*mm))

    # Visual flow
    story.append(Paragraph("<b>Lu\u1ed3ng tri\u1ec3n khai \u0111\u1ec1 xu\u1ea5t:</b>", s_h2))
    story.append(Spacer(1, 2*mm))

    flow_style = ParagraphStyle('Flow', fontName='Arial', fontSize=10, textColor=DARK, leading=18, alignment=TA_CENTER)
    flow_text = """<b><font color="#1a56db">GT1</font></b> N\u1ec1n m\u00f3ng  <font color="#6b7280">\u2192</font>  <b><font color="#1a56db">GT2</font></b> L\u1edbp h\u1ecdc  <font color="#6b7280">\u2192</font>  <b><font color="#1a56db">GT3</font></b> \u0110i\u1ec3m danh  |  <b><font color="#1a56db">GT4</font></b> B\u00e0i gi\u1ea3ng  |  <b><font color="#1a56db">GT6</font></b> H\u1ecdc ph\u00ed  |  <b><font color="#1a56db">GT7</font></b> TKB  |  <b><font color="#1a56db">GT9</font></b> C\u0110<br/><font color="#6b7280">\u2193</font><br/><b><font color="#1a56db">GT5</font></b> B\u00e0i t\u1eadp (c\u1ea7n GT4)  <font color="#6b7280">\u2192</font>  <b><font color="#1a56db">GT8</font></b> B\u00e1o c\u00e1o (c\u1ea7n GT3\u2013GT6)  <font color="#6b7280">\u2192</font>  <b><font color="#dc2626">GT10</font></b> Ho\u00e0n thi\u1ec7n &amp; Go-live"""
    story.append(Paragraph(flow_text, flow_style))

    story.append(Spacer(1, 4*mm))
    story.append(HRFlowable(width="100%", thickness=0.5, color=BORDER))
    story.append(Spacer(1, 2*mm))
    story.append(Paragraph("TANOSHI VIETNAM", ParagraphStyle('F', fontName='Arial-Bold', fontSize=11, textColor=PRIMARY, alignment=TA_CENTER, spaceAfter=1*mm)))
    story.append(Paragraph("K\u1ebf ho\u1ea1ch tri\u1ec3n khai h\u1ec7 th\u1ed1ng qu\u1ea3n l\u00fd trung t\u00e2m gi\u00e1o d\u1ee5c", s_small))

    doc.build(story, canvasmaker=HeaderFooterCanvas)
    print(f"PDF created: {os.path.abspath(OUTPUT)}")


if __name__ == "__main__":
    build_pdf()
