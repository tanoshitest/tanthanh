# -*- coding: utf-8 -*-
import os
from reportlab.lib.pagesizes import A4, landscape
from reportlab.lib.units import mm
from reportlab.lib.colors import HexColor, white
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.enums import TA_LEFT, TA_CENTER
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle,
    PageBreak, HRFlowable, KeepTogether
)
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfbase.pdfmetrics import registerFontFamily
from reportlab.pdfgen import canvas as canvasmod

# ── Fonts ─────────────────────────────────────────────────────────
FD = "C:/Windows/Fonts"
pdfmetrics.registerFont(TTFont("Arial", os.path.join(FD, "arial.ttf")))
pdfmetrics.registerFont(TTFont("ArialB", os.path.join(FD, "arialbd.ttf")))
pdfmetrics.registerFont(TTFont("ArialI", os.path.join(FD, "ariali.ttf")))
pdfmetrics.registerFont(TTFont("ArialBI", os.path.join(FD, "arialbi.ttf")))
registerFontFamily('Arial', normal='Arial', bold='ArialB', italic='ArialI', boldItalic='ArialBI')
pdfmetrics.registerFont(TTFont("Sym", os.path.join(FD, "seguisym.ttf")))

# ── Colors ────────────────────────────────────────────────────────
C_PRIMARY   = HexColor("#1a56db")
C_DARK      = HexColor("#1f2937")
C_GRAY      = HexColor("#6b7280")
C_LGRAY     = HexColor("#9ca3af")
C_BG        = HexColor("#f9fafb")
C_BORDER    = HexColor("#e5e7eb")
C_WHITE     = white

# Phase colors
C_P1  = HexColor("#1a56db")  # blue
C_P2  = HexColor("#7c3aed")  # purple
C_P3  = HexColor("#059669")  # green
C_P4  = HexColor("#0891b2")  # cyan
C_P5  = HexColor("#d97706")  # amber
C_P6  = HexColor("#dc2626")  # red
C_P7  = HexColor("#4f46e5")  # indigo
C_P8  = HexColor("#0d9488")  # teal
C_P9  = HexColor("#c026d3")  # fuchsia
C_P10 = HexColor("#be123c")  # rose

C_P1_L  = HexColor("#eff6ff")
C_P2_L  = HexColor("#f5f3ff")
C_P3_L  = HexColor("#ecfdf5")
C_P4_L  = HexColor("#ecfeff")
C_P5_L  = HexColor("#fffbeb")
C_P6_L  = HexColor("#fef2f2")
C_P7_L  = HexColor("#eef2ff")
C_P8_L  = HexColor("#f0fdfa")
C_P9_L  = HexColor("#fdf4ff")
C_P10_L = HexColor("#fff1f2")

PAGE_W, PAGE_H = landscape(A4)
LM = 15*mm; RM = 15*mm; TM = 24*mm; BM = 18*mm
CW = PAGE_W - LM - RM

OUTPUT = "Tanoshi_Vietnam_Timeline_Checklist.pdf"


# ── Header / Footer ──────────────────────────────────────────────
class HFCanvas(canvasmod.Canvas):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._pn = 0

    def showPage(self):
        self._pn += 1
        self._hf()
        super().showPage()

    def _hf(self):
        self.saveState()
        yl = PAGE_H - 14*mm
        self.setStrokeColor(C_PRIMARY); self.setLineWidth(1)
        self.line(LM, yl, PAGE_W - RM, yl)
        self.setFont("ArialB", 8); self.setFillColor(C_PRIMARY)
        self.drawString(LM, yl + 2.5*mm, "TANOSHI VIETNAM")
        self.setFont("Arial", 7.5); self.setFillColor(C_GRAY)
        self.drawRightString(PAGE_W - RM, yl + 2.5*mm, "Timeline Checklist \u2013 K\u1ebf ho\u1ea1ch tri\u1ec3n khai")
        yf = 10*mm
        self.setStrokeColor(C_BORDER); self.setLineWidth(0.4)
        self.line(LM, yf + 3*mm, PAGE_W - RM, yf + 3*mm)
        self.setFont("Arial", 7); self.setFillColor(C_LGRAY)
        self.drawString(LM, yf, "Tanoshi Vietnam \u2013 H\u1ec7 th\u1ed1ng Qu\u1ea3n l\u00fd Trung t\u00e2m Gi\u00e1o d\u1ee5c")
        self.drawRightString(PAGE_W - RM, yf, f"Trang {self._pn}")
        self.restoreState()


# ── Styles ────────────────────────────────────────────────────────
def ps(name, **kw):
    return ParagraphStyle(name, fontName=kw.get('f','Arial'), fontSize=kw.get('s',9),
        textColor=kw.get('c',C_DARK), leading=kw.get('ld',13),
        alignment=kw.get('a',TA_LEFT), spaceAfter=kw.get('sa',0),
        spaceBefore=kw.get('sb',0))

s_th    = ps('TH', f='ArialB', s=8, c=C_WHITE, a=TA_CENTER)
s_th_l  = ps('THL', f='ArialB', s=8, c=C_WHITE)
s_td    = ps('TD', s=8.5, ld=12)
s_tdc   = ps('TDC', s=8.5, a=TA_CENTER, ld=12)
s_tdb   = ps('TDB', f='ArialB', s=8.5, ld=12)
s_sm    = ps('SM', s=8, c=C_GRAY, a=TA_CENTER)
s_phase = ps('PH', f='ArialB', s=9, c=C_WHITE)

# Checkbox
BOX = "<font name='Sym' size='11'>\u2610</font>"


# ── Data ──────────────────────────────────────────────────────────
PHASES = [
    {
        "num": 1, "title": "N\u1ec1n m\u00f3ng h\u1ec7 th\u1ed1ng",
        "color": C_P1, "bg": C_P1_L,
        "tasks": [
            [1, "Thi\u1ebft k\u1ebf database schema", "Backend"],
            [2, "Setup backend project", "Backend"],
            [3, "API x\u00e1c th\u1ef1c (Auth)", "Backend"],
            [4, "API qu\u1ea3n l\u00fd ng\u01b0\u1eddi d\u00f9ng", "Backend"],
            [5, "Quan h\u1ec7 ph\u1ee5 huynh\u2013h\u1ecdc sinh", "Backend"],
            [6, "Layout 3 role (Admin/GV/PH)", "Frontend"],
            [7, "Trang \u0111\u0103ng nh\u1eadp th\u1eadt", "Frontend"],
            [8, "Routing &amp; b\u1ea3o v\u1ec7 \u0111\u01b0\u1eddng d\u1eabn", "Frontend"],
            [9, "K\u1ebft n\u1ed1i Frontend \u2194 Backend", "Fullstack"],
        ],
        "tests": [
            "\u0110\u0103ng nh\u1eadp \u0111\u00fang role \u2192 v\u00e0o \u0111\u00fang giao di\u1ec7n",
            "CRUD ng\u01b0\u1eddi d\u00f9ng \u0111\u1ea7y \u0111\u1ee7",
            "PH chuy\u1ec3n \u0111\u1ed5i xem 2 con",
            "Sai role \u2192 b\u1ecb ch\u1eb7n, API l\u1ed7i \u2192 kh\u00f4ng crash",
        ]
    },
    {
        "num": 2, "title": "Qu\u1ea3n l\u00fd l\u1edbp h\u1ecdc",
        "color": C_P2, "bg": C_P2_L,
        "tasks": [
            [10, "API &amp; UI qu\u1ea3n l\u00fd l\u1edbp", "Fullstack"],
            [11, "G\u00e1n h\u1ecdc sinh v\u00e0o l\u1edbp", "Fullstack"],
            [12, "Qu\u1ea3n l\u00fd l\u1ecbch h\u1ecdc c\u1ee7a l\u1edbp", "Fullstack"],
            [13, "Qu\u1ea3n l\u00fd bu\u1ed5i h\u1ecdc (Session)", "Fullstack"],
            [14, "L\u1ecdc l\u1edbp theo tr\u00ecnh \u0111\u1ed9", "Frontend"],
            [15, "GV xem l\u1edbp m\u00ecnh d\u1ea1y", "Backend"],
            [16, "PH xem l\u1edbp con h\u1ecdc", "Backend"],
        ],
        "tests": [
            "T\u1ea1o l\u1edbp \u2192 g\u00e1n GV \u2192 th\u00eam HS \u2192 \u0111\u00fang s\u0129 s\u1ed1",
            "V\u01b0\u1ee3t s\u0129 s\u1ed1 \u2192 b\u00e1o l\u1ed7i",
            "GV/PH ch\u1ec9 th\u1ea5y l\u1edbp c\u1ee7a m\u00ecnh",
        ]
    },
    {
        "num": 3, "title": "\u0110i\u1ec3m danh &amp; \u0110\u00e1nh gi\u00e1",
        "color": C_P3, "bg": C_P3_L,
        "tasks": [
            [17, "API &amp; UI \u0111i\u1ec3m danh", "Fullstack"],
            [18, "Admin xem \u0111i\u1ec3m danh", "Frontend"],
            [19, "PH xem \u0111i\u1ec3m danh con", "Frontend"],
            [20, "API &amp; UI \u0111\u00e1nh gi\u00e1 6 ti\u00eau ch\u00ed", "Fullstack"],
            [21, "Bi\u1ec3u \u0111\u1ed3 Radar chart", "Frontend"],
            [22, "PH xin ph\u00e9p ngh\u1ec9 h\u1ecdc", "Fullstack"],
        ],
        "tests": [
            "GV \u0111i\u1ec3m danh \u2192 Admin+PH xem \u0111\u00fang",
            "Radar chart 6 tr\u1ee5c hi\u1ec3n th\u1ecb \u0111\u00fang",
            "PH ch\u1ec9 th\u1ea5y \u0111\u00e1nh gi\u00e1 con m\u00ecnh",
        ]
    },
    {
        "num": 4, "title": "B\u00e0i gi\u1ea3ng &amp; N\u1ed9i dung",
        "color": C_P4, "bg": C_P4_L,
        "tasks": [
            [23, "API &amp; UI qu\u1ea3n l\u00fd b\u00e0i gi\u1ea3ng", "Fullstack"],
            [24, "Upload &amp; ph\u00e1t video", "Fullstack"],
            [25, "Tr\u1eafc nghi\u1ec7m trong video", "Frontend"],
            [26, "T\u00e0i li\u1ec7u \u0111\u00ednh k\u00e8m", "Fullstack"],
            [27, "B\u00e0i ki\u1ec3m tra t\u1ed5ng h\u1ee3p", "Fullstack"],
            [28, "B\u00e0i t\u1eadp vi\u1ebft lu\u1eadn", "Fullstack"],
            [29, "Li\u00ean k\u1ebft b\u00e0i gi\u1ea3ng \u2194 bu\u1ed5i h\u1ecdc", "Backend"],
        ],
        "tests": [
            "Video d\u1eebng \u2192 quiz \u2192 \u0111\u00fang \u2192 ti\u1ebfp t\u1ee5c",
            "Upload PDF \u2192 PH t\u1ea3i v\u1ec1 \u0111\u00fang file",
            "B\u1ea3n nh\u00e1p \u2192 HS/PH kh\u00f4ng th\u1ea5y",
        ]
    },
    {
        "num": 5, "title": "B\u00e0i t\u1eadp &amp; \u0110\u1ec1 thi th\u1eed",
        "color": C_P5, "bg": C_P5_L,
        "tasks": [
            [30, "API &amp; UI giao b\u00e0i t\u1eadp", "Fullstack"],
            [31, "HS n\u1ed9p b\u00e0i t\u1eadp", "Frontend"],
            [32, "GV ch\u1ea5m b\u00e0i t\u1eadp", "Fullstack"],
            [33, "Th\u1ed1ng k\u00ea n\u1ed9p b\u00e0i", "Backend"],
            [34, "API &amp; UI \u0111\u1ec1 thi th\u1eed", "Fullstack"],
            [35, "B\u1ea3ng x\u1ebfp h\u1ea1ng \u0111\u1ec1 thi", "Frontend"],
        ],
        "tests": [
            "GV giao \u2192 HS n\u1ed9p \u2192 GV ch\u1ea5m \u2192 PH xem \u0111i\u1ec3m",
            "Qu\u00e1 h\u1ea1n \u2192 hi\u1ec3n th\u1ecb \u0111\u00fang tr\u1ea1ng th\u00e1i",
            "B\u1ea3ng x\u1ebfp h\u1ea1ng \u0111\u00fang th\u1ee9 t\u1ef1 \u0111i\u1ec3m",
        ]
    },
    {
        "num": 6, "title": "H\u1ecdc ph\u00ed &amp; L\u01b0\u01a1ng",
        "color": C_P6, "bg": C_P6_L,
        "tasks": [
            [36, "API &amp; UI qu\u1ea3n l\u00fd h\u1ecdc ph\u00ed", "Fullstack"],
            [37, "PH xem &amp; \u0111\u1ed1i so\u00e1t h\u1ecdc ph\u00ed", "Frontend"],
            [38, "Admin c\u1eadp nh\u1eadt tr\u1ea1ng th\u00e1i", "Fullstack"],
            [39, "Nh\u1eafc h\u1ecdc ph\u00ed qua Zalo", "Frontend"],
            [40, "API &amp; UI t\u00ednh l\u01b0\u01a1ng GV", "Fullstack"],
            [41, "GV xem thu nh\u1eadp c\u00e1 nh\u00e2n", "Frontend"],
        ],
        "tests": [
            "Ch\u01b0a \u0111\u00f3ng \u2192 Admin x\u00e1c nh\u1eadn \u2192 \u0111\u00e3 \u0111\u00f3ng",
            "T\u00ednh l\u01b0\u01a1ng GV/Tr\u1ee3 gi\u1ea3ng \u0111\u00fang c\u00f4ng th\u1ee9c",
            "GV ch\u1ec9 th\u1ea5y l\u01b0\u01a1ng c\u1ee7a m\u00ecnh",
        ]
    },
    {
        "num": 7, "title": "Th\u1eddi kh\u00f3a bi\u1ec3u",
        "color": C_P7, "bg": C_P7_L,
        "tasks": [
            [42, "API l\u1ecbch tu\u1ea7n", "Backend"],
            [43, "UI l\u1ecbch tu\u1ea7n d\u1ea1ng b\u1ea3ng", "Frontend"],
            [44, "Admin th\u00eam/s\u1eeda/x\u00f3a l\u1ecbch", "Fullstack"],
            [45, "GV xem l\u1ecbch c\u00e1 nh\u00e2n", "Frontend"],
        ],
        "tests": [
            "Th\u00eam l\u1ecbch \u2192 hi\u1ec7n \u0111\u00fang v\u1ecb tr\u00ed",
            "Chuy\u1ec3n tu\u1ea7n \u2192 data \u0111\u1ed5i \u0111\u00fang",
            "GV ch\u1ec9 th\u1ea5y l\u1ecbch c\u1ee7a m\u00ecnh",
        ]
    },
    {
        "num": 8, "title": "B\u00e1o c\u00e1o &amp; Dashboard",
        "color": C_P8, "bg": C_P8_L,
        "tasks": [
            [46, "Dashboard ph\u1ee5 huynh", "Fullstack"],
            [47, "B\u00e1o c\u00e1o l\u01b0\u01a1ng GV", "Fullstack"],
            [48, "B\u00e1o c\u00e1o h\u1ecdc ph\u00ed", "Fullstack"],
            [49, "B\u00e1o c\u00e1o chuy\u00ean c\u1ea7n", "Fullstack"],
            [50, "B\u00e1o c\u00e1o h\u1ecdc l\u1ef1c (Radar)", "Frontend"],
            [51, "B\u00e1o c\u00e1o h\u1ecdc t\u1eadp PH", "Frontend"],
        ],
        "tests": [
            "\u0110\u1ed5i con \u2192 Dashboard \u0111\u1ed5i data",
            "T\u1ed5ng l\u01b0\u01a1ng kh\u1edbp chi ti\u1ebft t\u1eebng GV",
            "T\u1ed5ng thu + ch\u01b0a thu = t\u1ed5ng ph\u00e1t sinh",
            "Radar 6 tr\u1ee5c \u0111\u00fang gi\u00e1 tr\u1ecb TB",
        ]
    },
    {
        "num": 9, "title": "C\u1ed9ng \u0111\u1ed3ng, Th\u01b0 vi\u1ec7n, C\u00e0i \u0111\u1eb7t",
        "color": C_P9, "bg": C_P9_L,
        "tasks": [
            [52, "API &amp; UI c\u1ed9ng \u0111\u1ed3ng", "Fullstack"],
            [53, "API &amp; UI th\u01b0 vi\u1ec7n t\u00e0i li\u1ec7u", "Fullstack"],
            [54, "C\u00e0i \u0111\u1eb7t trung t\u00e2m", "Fullstack"],
        ],
        "tests": [
            "\u0110\u0103ng b\u00e0i \u2192 b\u00ecnh lu\u1eadn \u2192 ghim b\u00e0i",
            "Upload &amp; download t\u00e0i li\u1ec7u",
            "S\u1eeda c\u00e0i \u0111\u1eb7t \u2192 c\u1eadp nh\u1eadt",
        ]
    },
    {
        "num": 10, "title": "Ho\u00e0n thi\u1ec7n &amp; Go-live",
        "color": C_P10, "bg": C_P10_L,
        "tasks": [
            [55, "Responsive mobile/tablet", "Frontend"],
            [56, "T\u1ed1i \u01b0u hi\u1ec7u n\u0103ng", "Fullstack"],
            [57, "B\u1ea3o m\u1eadt (XSS, SQL injection...)", "Backend"],
            [58, "UAT \u2013 Test v\u1edbi ng\u01b0\u1eddi d\u00f9ng th\u1eadt", "QA"],
            [59, "S\u1eeda bug t\u1eeb UAT", "Fullstack"],
            [60, "Deploy production", "DevOps"],
        ],
        "tests": [
            "Lu\u1ed3ng end-to-end ch\u1ea1y m\u01b0\u1ee3t",
            "Chrome + Safari + Firefox OK",
            "50 user \u0111\u1ed3ng th\u1eddi kh\u00f4ng lag",
        ]
    },
]


# ── Build ─────────────────────────────────────────────────────────
def build():
    doc = SimpleDocTemplate(OUTPUT, pagesize=landscape(A4),
        leftMargin=LM, rightMargin=RM, topMargin=TM, bottomMargin=BM,
        title="Tanoshi Vietnam - Timeline Checklist", author="Tanoshi Vietnam")
    story = []

    # ── COVER ──
    story.append(Spacer(1, 25*mm))
    story.append(Paragraph("TANOSHI VIETNAM", ps('B1', f='ArialB', s=28, c=C_PRIMARY, a=TA_CENTER, sa=5*mm)))
    story.append(HRFlowable(width="35%", thickness=2, color=C_PRIMARY, spaceBefore=2*mm, spaceAfter=6*mm))
    story.append(Paragraph("TIMELINE CHECKLIST", ps('B2', f='ArialB', s=20, c=C_DARK, a=TA_CENTER, sa=3*mm)))
    story.append(Paragraph("Theo d\u00f5i ti\u1ebfn \u0111\u1ed9 tri\u1ec3n khai t\u1eebng \u0111\u1ea7u vi\u1ec7c", ps('B3', s=12, c=C_GRAY, a=TA_CENTER, sa=15*mm)))

    # Summary stats
    stat_h = ps('SH', f='ArialB', s=22, c=C_PRIMARY, a=TA_CENTER)
    stat_l = ps('SL', s=9, c=C_GRAY, a=TA_CENTER)
    stat_data = [
        [Paragraph("10", stat_h), Paragraph("60", stat_h), Paragraph("33", stat_h)],
        [Paragraph("Giai \u0111o\u1ea1n", stat_l), Paragraph("\u0110\u1ea7u vi\u1ec7c", stat_l), Paragraph("M\u1ed1c test", stat_l)],
    ]
    stat_t = Table(stat_data, colWidths=[60*mm, 60*mm, 60*mm])
    stat_t.setStyle(TableStyle([
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('TOPPADDING', (0,0), (-1,0), 4*mm),
        ('BOTTOMPADDING', (0,1), (-1,1), 4*mm),
        ('LINEBELOW', (0,0), (-1,0), 0, C_WHITE),
        ('LINEBEFORE', (1,0), (1,-1), 0.5, C_BORDER),
        ('LINEBEFORE', (2,0), (2,-1), 0.5, C_BORDER),
        ('BOX', (0,0), (-1,-1), 0.5, C_BORDER),
        ('BACKGROUND', (0,0), (-1,-1), C_BG),
    ]))
    story.append(stat_t)
    story.append(Spacer(1, 12*mm))

    # Legend
    legend_s = ps('LG', s=8.5, c=C_DARK)
    legend_data = [[
        Paragraph(f"{BOX} = Ch\u01b0a l\u00e0m", legend_s),
        Paragraph("<font name='Sym' color='#059669' size='11'>\u2611</font> = Ho\u00e0n th\u00e0nh", legend_s),
        Paragraph("<font color='#1a56db'><b>Backend</b></font> / <font color='#7c3aed'><b>Frontend</b></font> / <font color='#d97706'><b>Fullstack</b></font> / <font color='#dc2626'><b>QA</b></font> / <font color='#059669'><b>DevOps</b></font>", legend_s),
    ]]
    leg_t = Table(legend_data, colWidths=[55*mm, 55*mm, CW - 110*mm])
    leg_t.setStyle(TableStyle([
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('TOPPADDING', (0,0), (-1,-1), 2*mm),
        ('BOTTOMPADDING', (0,0), (-1,-1), 2*mm),
        ('LEFTPADDING', (0,0), (-1,-1), 4*mm),
        ('BOX', (0,0), (-1,-1), 0.5, C_BORDER),
        ('BACKGROUND', (0,0), (-1,-1), C_BG),
    ]))
    story.append(leg_t)
    story.append(PageBreak())

    # ── EACH PHASE ──
    type_colors = {
        "Backend": "#1a56db",
        "Frontend": "#7c3aed",
        "Fullstack": "#d97706",
        "QA": "#dc2626",
        "DevOps": "#059669",
    }

    for phase in PHASES:
        pn = phase["num"]
        pc = phase["color"]
        pb = phase["bg"]

        # Phase header bar
        ph_data = [[Paragraph(
            f"<b>GIAI \u0110O\u1ea0N {pn}:  {phase['title']}</b>", s_phase)]]
        ph_t = Table(ph_data, colWidths=[CW])
        ph_t.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,-1), pc),
            ('TOPPADDING', (0,0), (-1,-1), 3*mm),
            ('BOTTOMPADDING', (0,0), (-1,-1), 3*mm),
            ('LEFTPADDING', (0,0), (-1,-1), 4*mm),
        ]))
        story.append(ph_t)
        story.append(Spacer(1, 2*mm))

        # Task table
        # Columns: Check | # | Task | Type | Assigned | Start | End | Status | Notes
        col_w = [12*mm, 10*mm, 72*mm, 22*mm, 30*mm, 24*mm, 24*mm, 24*mm, CW - 218*mm]

        hdr = [
            Paragraph(f"{BOX}", ps('H0', f='ArialB', s=8, c=C_WHITE, a=TA_CENTER)),
            Paragraph("<b>#</b>", s_th),
            Paragraph("<b>\u0110\u1ea7u vi\u1ec7c</b>", s_th_l),
            Paragraph("<b>Lo\u1ea1i</b>", s_th),
            Paragraph("<b>Ng\u01b0\u1eddi l\u00e0m</b>", s_th),
            Paragraph("<b>B\u1eaft \u0111\u1ea7u</b>", s_th),
            Paragraph("<b>Ho\u00e0n th\u00e0nh</b>", s_th),
            Paragraph("<b>Tr\u1ea1ng th\u00e1i</b>", s_th),
            Paragraph("<b>Ghi ch\u00fa</b>", s_th_l),
        ]
        tdata = [hdr]

        for t in phase["tasks"]:
            tc = type_colors.get(t[2], "#6b7280")
            type_label = t[2].replace("&", "&amp;")
            tdata.append([
                Paragraph(BOX, ps('CB', s=10, a=TA_CENTER)),
                Paragraph(str(t[0]), s_tdc),
                Paragraph(f"<b>{t[1]}</b>", s_tdb),
                Paragraph(f"<font color='{tc}'><b>{type_label}</b></font>", ps('TP', s=8, a=TA_CENTER)),
                Paragraph("", s_td),  # Assigned - blank to fill
                Paragraph("__/__/__", ps('DT', s=7.5, c=C_LGRAY, a=TA_CENTER)),
                Paragraph("__/__/__", ps('DT2', s=7.5, c=C_LGRAY, a=TA_CENTER)),
                Paragraph("", s_tdc),  # Status - blank to fill
                Paragraph("", s_td),  # Notes - blank
            ])

        tt = Table(tdata, colWidths=col_w, repeatRows=1)
        tt.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), pc),
            ('GRID', (0, 0), (-1, -1), 0.4, C_BORDER),
            ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
            ('TOPPADDING', (0, 0), (-1, -1), 2*mm),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 2*mm),
            ('LEFTPADDING', (0, 0), (-1, -1), 1.5*mm),
            ('RIGHTPADDING', (0, 0), (-1, -1), 1.5*mm),
            ('ROWBACKGROUNDS', (0, 1), (-1, -1), [C_WHITE, pb]),
        ]))
        story.append(tt)
        story.append(Spacer(1, 2*mm))

        # Test milestones
        test_items = phase["tests"]
        test_rows = []
        test_hdr = [
            Paragraph(f"<font name='Sym' color='#059669' size='10'>\u2611</font>", ps('TH1', s=8, a=TA_CENTER)),
            Paragraph(f"<b>M\u1ed1c test GT{pn}</b>",
                      ps('TH2', f='ArialB', s=8, c=HexColor("#059669"))),
            Paragraph("<b>K\u1ebft qu\u1ea3</b>",
                      ps('TH3', f='ArialB', s=8, c=HexColor("#059669"), a=TA_CENTER)),
        ]
        test_rows.append(test_hdr)
        for ti in test_items:
            test_rows.append([
                Paragraph(BOX, ps('TCB', s=10, a=TA_CENTER)),
                Paragraph(ti, ps('TT', s=8.5)),
                Paragraph("", ps('TR', s=8, a=TA_CENTER)),  # blank for Pass/Fail
            ])

        tw = [12*mm, CW - 52*mm, 40*mm]
        test_t = Table(test_rows, colWidths=tw)
        test_t.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), HexColor("#ecfdf5")),
            ('GRID', (0, 0), (-1, -1), 0.4, C_BORDER),
            ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
            ('TOPPADDING', (0, 0), (-1, -1), 1.5*mm),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 1.5*mm),
            ('LEFTPADDING', (0, 0), (-1, -1), 2*mm),
            ('RIGHTPADDING', (0, 0), (-1, -1), 2*mm),
            ('ROWBACKGROUNDS', (0, 1), (-1, -1), [C_WHITE, HexColor("#f0fdf4")]),
        ]))
        story.append(test_t)
        story.append(Spacer(1, 6*mm))

        # Page break after certain phases to keep layout clean
        if pn in [2, 4, 6, 8]:
            story.append(PageBreak())

    # ── FINAL: SIGN-OFF ──
    story.append(PageBreak())
    story.append(Paragraph("K\u00dd X\u00c1C NH\u1eacN HO\u00c0N TH\u00c0NH", ps('SO', f='ArialB', s=16, c=C_PRIMARY, a=TA_CENTER, sa=8*mm)))
    story.append(HRFlowable(width="100%", thickness=0.5, color=C_BORDER, spaceAfter=6*mm))

    sign_s = ps('SG', s=10, c=C_DARK, a=TA_CENTER)
    sign_b = ps('SGB', f='ArialB', s=10, c=C_DARK, a=TA_CENTER)
    sign_line = ps('SGL', s=9, c=C_LGRAY, a=TA_CENTER)

    sign_data = [
        [Paragraph("<b>Qu\u1ea3n l\u00fd d\u1ef1 \u00e1n</b>", sign_b),
         Paragraph("", sign_s),
         Paragraph("<b>Tr\u01b0\u1edfng nh\u00f3m Dev</b>", sign_b),
         Paragraph("", sign_s),
         Paragraph("<b>Kh\u00e1ch h\u00e0ng</b>", sign_b)],
        [Paragraph("", sign_s)] * 5,
        [Paragraph("", sign_s)] * 5,
        [Paragraph("", sign_s)] * 5,
        [Paragraph("H\u1ecd t\u00ean: _________________", sign_line),
         Paragraph("", sign_s),
         Paragraph("H\u1ecd t\u00ean: _________________", sign_line),
         Paragraph("", sign_s),
         Paragraph("H\u1ecd t\u00ean: _________________", sign_line)],
        [Paragraph("Ng\u00e0y: ____/____/________", sign_line),
         Paragraph("", sign_s),
         Paragraph("Ng\u00e0y: ____/____/________", sign_line),
         Paragraph("", sign_s),
         Paragraph("Ng\u00e0y: ____/____/________", sign_line)],
        [Paragraph("", sign_s)] * 5,
        [Paragraph("<i>Ch\u1eef k\u00fd</i>", sign_line),
         Paragraph("", sign_s),
         Paragraph("<i>Ch\u1eef k\u00fd</i>", sign_line),
         Paragraph("", sign_s),
         Paragraph("<i>Ch\u1eef k\u00fd</i>", sign_line)],
    ]

    gap = 10*mm
    col = (CW - 2*gap) / 3
    sign_t = Table(sign_data, colWidths=[col, gap, col, gap, col])
    sign_t.setStyle(TableStyle([
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('TOPPADDING', (0,0), (-1,-1), 2*mm),
        ('BOTTOMPADDING', (0,0), (-1,-1), 2*mm),
        ('LINEBELOW', (0, 0), (0, 0), 0.5, C_PRIMARY),
        ('LINEBELOW', (2, 0), (2, 0), 0.5, C_PRIMARY),
        ('LINEBELOW', (4, 0), (4, 0), 0.5, C_PRIMARY),
    ]))
    story.append(Spacer(1, 8*mm))
    story.append(sign_t)

    story.append(Spacer(1, 15*mm))
    story.append(HRFlowable(width="100%", thickness=0.5, color=C_BORDER))
    story.append(Spacer(1, 3*mm))
    story.append(Paragraph("TANOSHI VIETNAM", ps('FT', f='ArialB', s=11, c=C_PRIMARY, a=TA_CENTER, sa=1*mm)))
    story.append(Paragraph("Timeline Checklist \u2013 K\u1ebf ho\u1ea1ch tri\u1ec3n khai h\u1ec7 th\u1ed1ng qu\u1ea3n l\u00fd trung t\u00e2m gi\u00e1o d\u1ee5c", s_sm))

    doc.build(story, canvasmaker=HFCanvas)
    print(f"PDF created: {os.path.abspath(OUTPUT)}")


if __name__ == "__main__":
    build()
