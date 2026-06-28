from pathlib import Path

import qrcode
from docx import Document
from docx.enum.section import WD_SECTION
from docx.enum.table import WD_ALIGN_VERTICAL, WD_CELL_VERTICAL_ALIGNMENT, WD_ROW_HEIGHT_RULE
from docx.enum.text import WD_ALIGN_PARAGRAPH, WD_BREAK, WD_LINE_SPACING
from docx.oxml import OxmlElement
from docx.oxml.ns import qn
from docx.shared import Cm, Inches, Pt, RGBColor


ROOT = Path(__file__).resolve().parents[1]
OUT_DIR = ROOT / "deliverables"
DOCX_PATH = OUT_DIR / "LandVerifyCM_One_Page_Poster.docx"
QR_PATH = OUT_DIR / "LandVerifyCM_Mobile_QR.png"

APP_URL = "https://land-verification-mobile-production.up.railway.app"

GREEN_DARK = "123D32"
GREEN = "13795B"
GREEN_MID = "20A57A"
MINT = "EAF7F1"
MINT_2 = "F2FAF6"
BLUE_MIST = "EEF7F8"
GOLD_MIST = "FFF8E8"
GOLD = "D59A16"
INK = "19352E"
TEXT = "334E47"
MUTED = "62766F"
WHITE = "FFFFFF"
BORDER = "B8D8CC"


def set_cell_shading(cell, fill: str):
    tc_pr = cell._tc.get_or_add_tcPr()
    shd = tc_pr.find(qn("w:shd"))
    if shd is None:
        shd = OxmlElement("w:shd")
        tc_pr.append(shd)
    shd.set(qn("w:fill"), fill)


def set_cell_margins(cell, top=170, start=190, bottom=150, end=190):
    tc = cell._tc
    tc_pr = tc.get_or_add_tcPr()
    tc_mar = tc_pr.first_child_found_in("w:tcMar")
    if tc_mar is None:
        tc_mar = OxmlElement("w:tcMar")
        tc_pr.append(tc_mar)
    for margin, value in (("top", top), ("start", start), ("bottom", bottom), ("end", end)):
        node = tc_mar.find(qn(f"w:{margin}"))
        if node is None:
            node = OxmlElement(f"w:{margin}")
            tc_mar.append(node)
        node.set(qn("w:w"), str(value))
        node.set(qn("w:type"), "dxa")


def set_table_borders(table, color=BORDER, size=12):
    tbl_pr = table._tbl.tblPr
    borders = tbl_pr.first_child_found_in("w:tblBorders")
    if borders is None:
        borders = OxmlElement("w:tblBorders")
        tbl_pr.append(borders)
    for edge in ("top", "left", "bottom", "right", "insideH", "insideV"):
        tag = f"w:{edge}"
        el = borders.find(qn(tag))
        if el is None:
            el = OxmlElement(tag)
            borders.append(el)
        el.set(qn("w:val"), "single")
        el.set(qn("w:sz"), str(size))
        el.set(qn("w:space"), "0")
        el.set(qn("w:color"), color)


def remove_table_borders(table):
    tbl_pr = table._tbl.tblPr
    borders = OxmlElement("w:tblBorders")
    for edge in ("top", "left", "bottom", "right", "insideH", "insideV"):
        el = OxmlElement(f"w:{edge}")
        el.set(qn("w:val"), "nil")
        borders.append(el)
    tbl_pr.append(borders)


def set_repeat_table_header(row):
    tr_pr = row._tr.get_or_add_trPr()
    tbl_header = OxmlElement("w:tblHeader")
    tbl_header.set(qn("w:val"), "true")
    tr_pr.append(tbl_header)


def keep_paragraph(paragraph, keep_next=False):
    p_pr = paragraph._p.get_or_add_pPr()
    keep_lines = OxmlElement("w:keepLines")
    p_pr.append(keep_lines)
    if keep_next:
        node = OxmlElement("w:keepNext")
        p_pr.append(node)


def set_run(run, size, color=TEXT, bold=False, font="Aptos"):
    run.font.name = font
    run._element.rPr.rFonts.set(qn("w:eastAsia"), font)
    run.font.size = Pt(size)
    run.font.color.rgb = RGBColor.from_string(color)
    run.bold = bold


def format_paragraph(paragraph, before=0, after=0, line=1.0, align=None):
    paragraph.paragraph_format.space_before = Pt(before)
    paragraph.paragraph_format.space_after = Pt(after)
    paragraph.paragraph_format.line_spacing = line
    if align is not None:
        paragraph.alignment = align


def add_panel_heading(cell, number, title, subtitle=None):
    p = cell.paragraphs[0]
    format_paragraph(p, after=1)
    keep_paragraph(p, keep_next=True)
    n = p.add_run(f"{number}  ")
    set_run(n, 9, GREEN, True)
    n.font.all_caps = True
    t = p.add_run(title.upper())
    set_run(t, 12.5, INK, True)
    t.font.all_caps = True
    if subtitle:
        s = cell.add_paragraph()
        format_paragraph(s, after=5, line=1.05)
        keep_paragraph(s, keep_next=True)
        run = s.add_run(subtitle)
        set_run(run, 8.2, MUTED, False)


def add_body(cell, text, size=8.4, color=TEXT, bold=False, before=0, after=4):
    p = cell.add_paragraph()
    format_paragraph(p, before=before, after=after, line=1.06)
    keep_paragraph(p)
    run = p.add_run(text)
    set_run(run, size, color, bold)
    return p


def add_bullet(cell, lead, text, size=8.1, after=2.4, color=TEXT):
    p = cell.add_paragraph(style=None)
    p.style = cell._parent.part.document.styles["Normal"]
    p.paragraph_format.left_indent = Cm(0.32)
    p.paragraph_format.first_line_indent = Cm(-0.25)
    format_paragraph(p, after=after, line=1.03)
    keep_paragraph(p)
    bullet = p.add_run("•  ")
    set_run(bullet, size + 1, GREEN_MID, True)
    if lead:
        lead_run = p.add_run(lead)
        set_run(lead_run, size, INK, True)
    body = p.add_run(text)
    set_run(body, size, color, False)
    return p


def add_numbered_step(cell, number, lead, text):
    p = cell.add_paragraph()
    p.paragraph_format.left_indent = Cm(0.38)
    p.paragraph_format.first_line_indent = Cm(-0.38)
    format_paragraph(p, after=2.6, line=1.02)
    keep_paragraph(p)
    badge = p.add_run(f"{number}  ")
    set_run(badge, 8.2, GREEN, True)
    lead_run = p.add_run(lead)
    set_run(lead_run, 8.1, INK, True)
    body = p.add_run(text)
    set_run(body, 8.1, TEXT)


def add_callout(cell, title, text, fill=GREEN_DARK, title_color="A7E8CF"):
    table = cell.add_table(rows=1, cols=1)
    table.autofit = False
    remove_table_borders(table)
    callout = table.cell(0, 0)
    set_cell_shading(callout, fill)
    set_cell_margins(callout, top=85, start=120, bottom=85, end=120)
    p = callout.paragraphs[0]
    format_paragraph(p, after=0, line=1.0)
    r1 = p.add_run(title.upper() + "  ")
    set_run(r1, 7.3, title_color, True)
    r2 = p.add_run(text)
    set_run(r2, 7.5, WHITE, True)
    return table


def set_row_exact_height(row, inches):
    row.height = Inches(inches)
    row.height_rule = WD_ROW_HEIGHT_RULE.EXACTLY


def add_horizontal_rule(paragraph, color=GREEN_MID, size=16):
    p_pr = paragraph._p.get_or_add_pPr()
    pbdr = OxmlElement("w:pBdr")
    bottom = OxmlElement("w:bottom")
    bottom.set(qn("w:val"), "single")
    bottom.set(qn("w:sz"), str(size))
    bottom.set(qn("w:space"), "1")
    bottom.set(qn("w:color"), color)
    pbdr.append(bottom)
    p_pr.append(pbdr)


def make_qr():
    qr = qrcode.QRCode(
        version=None,
        error_correction=qrcode.constants.ERROR_CORRECT_H,
        box_size=14,
        border=3,
    )
    qr.add_data(APP_URL)
    qr.make(fit=True)
    image = qr.make_image(fill_color=f"#{GREEN_DARK}", back_color=f"#{WHITE}").convert("RGB")
    image.save(QR_PATH, quality=100)


def add_document_background(section, color="F8FBF9"):
    document = section._document_part.document
    background = OxmlElement("w:background")
    background.set(qn("w:color"), color)
    document._element.insert(0, background)
    settings = document.settings._element
    display_bg = OxmlElement("w:displayBackgroundShape")
    settings.append(display_bg)


def create_poster():
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    make_qr()

    doc = Document()
    section = doc.sections[0]
    section.page_width = Cm(21.0)
    section.page_height = Cm(29.7)
    section.top_margin = Cm(0.75)
    section.bottom_margin = Cm(0.62)
    section.left_margin = Cm(0.78)
    section.right_margin = Cm(0.78)
    section.header_distance = Cm(0.2)
    section.footer_distance = Cm(0.2)
    add_document_background(section)

    normal = doc.styles["Normal"]
    normal.font.name = "Aptos"
    normal._element.rPr.rFonts.set(qn("w:eastAsia"), "Aptos")
    normal.font.size = Pt(8.2)
    normal.font.color.rgb = RGBColor.from_string(TEXT)
    normal.paragraph_format.space_after = Pt(0)

    # Header
    header = doc.add_table(rows=1, cols=2)
    header.autofit = False
    header.columns[0].width = Cm(14.9)
    header.columns[1].width = Cm(4.5)
    remove_table_borders(header)
    left, right = header.rows[0].cells
    set_cell_margins(left, top=0, start=0, bottom=0, end=50)
    set_cell_margins(right, top=0, start=60, bottom=0, end=0)

    p = left.paragraphs[0]
    format_paragraph(p, after=0)
    keep_paragraph(p, keep_next=True)
    brand = p.add_run("LAND")
    set_run(brand, 24, GREEN_DARK, True)
    verify = p.add_run("VERIFY")
    set_run(verify, 24, GREEN_MID, True)
    cm = p.add_run("CM")
    set_run(cm, 24, GREEN_DARK, True)

    p2 = left.add_paragraph()
    format_paragraph(p2, after=1, line=1.0)
    keep_paragraph(p2, keep_next=True)
    r = p2.add_run("DIGITAL LAND VERIFICATION FOR SAFER PROPERTY TRANSACTIONS")
    set_run(r, 9.4, INK, True)
    r.font.character_spacing = Pt(0.3)

    p3 = left.add_paragraph()
    format_paragraph(p3, after=2, line=1.0)
    keep_paragraph(p3, keep_next=True)
    r = p3.add_run(
        "PKFokam Institute of Excellence  |  Computing & Software Engineering  |  Capstone 2026"
    )
    set_run(r, 7.3, MUTED)
    add_horizontal_rule(p3)

    set_cell_shading(right, GREEN_DARK)
    right.vertical_alignment = WD_CELL_VERTICAL_ALIGNMENT.CENTER
    badge = right.paragraphs[0]
    format_paragraph(badge, after=2, align=WD_ALIGN_PARAGRAPH.CENTER)
    rr = badge.add_run("SECURE • BILINGUAL")
    set_run(rr, 8.1, "A7E8CF", True)
    badge2 = right.add_paragraph()
    format_paragraph(badge2, align=WD_ALIGN_PARAGRAPH.CENTER)
    rr = badge2.add_run("WEB + MOBILE")
    set_run(rr, 10.5, WHITE, True)

    spacer = doc.add_paragraph()
    format_paragraph(spacer, after=1)

    # Four-panel body
    table = doc.add_table(rows=2, cols=2)
    table.autofit = False
    table.allow_autofit = False
    set_table_borders(table)
    for row in table.rows:
        set_row_exact_height(row, 4.31)
        for cell in row.cells:
            cell.width = Cm(9.7)
            cell.vertical_alignment = WD_CELL_VERTICAL_ALIGNMENT.TOP
            set_cell_margins(cell)

    problem, methodology = table.rows[0].cells
    solution, qr_cell = table.rows[1].cells
    set_cell_shading(problem, MINT_2)
    set_cell_shading(methodology, BLUE_MIST)
    set_cell_shading(solution, MINT)
    set_cell_shading(qr_cell, GOLD_MIST)

    # 01 Problem proposal
    add_panel_heading(
        problem,
        "01",
        "Problem Proposal",
        "Why land buyers need a faster, safer way to verify ownership.",
    )
    add_body(
        problem,
        "Land fraud in Cameroon exposes citizens and investors to forged records, "
        "conflicting claims, costly disputes, and loss of property.",
        size=8.5,
        bold=True,
        after=4,
    )
    add_bullet(problem, "Duplicate or forged titles — ", "the same identity may be reused.")
    add_bullet(problem, "Hidden parcel overlap — ", "GPS conflicts are difficult to detect manually.")
    add_bullet(problem, "Fragmented evidence — ", "ownership and documents are hard to confirm quickly.")
    add_bullet(problem, "Low buyer confidence — ", "decisions are made without timely, reliable facts.")
    add_callout(
        problem,
        "Core need",
        "One trusted registry that verifies the title, location, and ownership trail before a transaction.",
    )

    # 02 Implementation methodology
    add_panel_heading(
        methodology,
        "02",
        "Implementation Methodology",
        "A secure, data-driven workflow from record entry to verification result.",
    )
    add_numbered_step(
        methodology,
        "1",
        "Design & requirements — ",
        "map buyer/admin journeys and deliver English–French access.",
    )
    add_numbered_step(
        methodology,
        "2",
        "Build the platform — ",
        "React web + Expo mobile → Express REST API → PostgreSQL/Prisma.",
    )
    add_numbered_step(
        methodology,
        "3",
        "Automate verification — ",
        "check title uniqueness and GPS distance with the Haversine formula.",
    )
    add_numbered_step(
        methodology,
        "4",
        "Secure & govern — ",
        "JWT, bcrypt, role controls, validation, uploads, and timestamped audit logs.",
    )
    add_callout(
        methodology,
        "Decision rules",
        "<10 m = DUPLICATE   •   <50 m = SUSPICIOUS   •   no conflict = VALID",
        fill="245B68",
        title_color="BDEEF1",
    )

    # 03 Solution proposal
    add_panel_heading(
        solution,
        "03",
        "Solution Proposal",
        "LandVerifyCM: a centralized verification platform for Cameroon.",
    )
    add_body(
        solution,
        "SEARCH  →  VERIFY  →  DECIDE WITH CONFIDENCE",
        size=9.2,
        color=GREEN_DARK,
        bold=True,
        after=5,
    )
    add_bullet(solution, "Instant registry search — ", "title number, owner name, or parcel ID.")
    add_bullet(solution, "Clear risk result — ", "Valid, Suspicious, or Duplicate status.")
    add_bullet(solution, "Map-based evidence — ", "GPS parcel location and proximity checks.")
    add_bullet(solution, "Complete record — ", "ownership chain and supporting PDF/image documents.")
    add_bullet(solution, "Controlled administration — ", "upload, edit, deactivate, browse, and audit records.")
    add_body(
        solution,
        "Outcome: greater transparency, earlier fraud detection, and safer land transactions.",
        size=8.1,
        color=INK,
        bold=True,
        before=1,
        after=2,
    )

    # 04 QR panel
    add_panel_heading(
        qr_cell,
        "04",
        "Scan the App",
        "Scan with your phone camera to open LandVerifyCM in the browser.",
    )
    qr_p = qr_cell.add_paragraph()
    format_paragraph(qr_p, before=1, after=1, align=WD_ALIGN_PARAGRAPH.CENTER)
    qr_p.add_run().add_picture(str(QR_PATH), width=Cm(5.9))
    scan = qr_cell.add_paragraph()
    format_paragraph(scan, after=2, line=1.0, align=WD_ALIGN_PARAGRAPH.CENTER)
    r = scan.add_run("SCAN • VERIFY • PROTECT")
    set_run(r, 9.7, GREEN_DARK, True)
    hint = qr_cell.add_paragraph()
    format_paragraph(hint, after=2, line=1.0, align=WD_ALIGN_PARAGRAPH.CENTER)
    r = hint.add_run("No installation required • Opens directly in your browser")
    set_run(r, 7.4, MUTED)
    tech = qr_cell.add_paragraph()
    format_paragraph(tech, after=0, line=1.0, align=WD_ALIGN_PARAGRAPH.CENTER)
    r = tech.add_run("React • TypeScript • Expo • Node.js • PostgreSQL")
    set_run(r, 7.2, GOLD, True)

    # Footer
    footer = doc.add_paragraph()
    format_paragraph(footer, before=3, after=0, line=1.0, align=WD_ALIGN_PARAGRAPH.CENTER)
    keep_paragraph(footer)
    r = footer.add_run("TEAM  ")
    set_run(r, 7.1, GREEN, True)
    r = footer.add_run("Tamaffo Fabrice  •  Nkam Titcha  •  Kemgang Leprince")
    set_run(r, 7.1, INK, True)
    r = footer.add_run("     |     ")
    set_run(r, 7.1, MUTED)
    r = footer.add_run("SUPERVISOR  ")
    set_run(r, 7.1, GREEN, True)
    r = footer.add_run("Mr. Joel Teto Kamdem")
    set_run(r, 7.1, INK, True)

    # Remove accidental empty paragraphs after tables where possible.
    doc.core_properties.title = "LandVerifyCM One-Page Project Poster"
    doc.core_properties.subject = "Problem, methodology, solution, and mobile app QR code"
    doc.core_properties.author = "LandVerifyCM Project Team"
    doc.core_properties.keywords = "land verification, Cameroon, fraud detection, GPS, capstone"

    doc.save(DOCX_PATH)
    print(DOCX_PATH)
    print(QR_PATH)


if __name__ == "__main__":
    create_poster()
