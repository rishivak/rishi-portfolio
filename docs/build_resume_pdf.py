#!/usr/bin/env python3
"""
Render Rishi_Sharma_Resume.html to a real A4 PDF.

No browser and no third-party library is reachable in this sandbox, so this
parses the resume HTML directly and emits PDF content streams using the base-14
fonts (no embedding required). Output is selectable, searchable text with
working link annotations.
"""
import re, html, zlib, os, sys

import sys as _s
_D = "/home/claudeuser/projects/mi-clarifi-app-phoenix/docs/"
SRC = _s.argv[1] if len(_s.argv) > 1 else _D + "Rishi_Sharma_Resume.html"
OUT = SRC[:-5] + ".pdf"

# ---------------------------------------------------------------- geometry
PW, PH = 595.276, 841.890          # A4 in points
M      = 39.7                      # 14mm margins
CW     = PW - 2 * M                # content width 515.9pt
TOP    = PH - M
BOT    = M

# ---------------------------------------------------------------- palette
INK   = (0.078, 0.094, 0.122)
INK2  = (0.235, 0.271, 0.322)
INK3  = (0.380, 0.424, 0.486)
ACC   = (0.043, 0.310, 0.620)
RULE  = (0.851, 0.871, 0.902)
RULE2 = (0.925, 0.937, 0.957)
CODEC = (0.031, 0.235, 0.471)

# ---------------------------------------------------------------- fonts
HELV = {32:278,33:278,34:355,35:556,36:556,37:889,38:667,39:191,40:333,41:333,42:389,43:584,
44:278,45:333,46:278,47:278,48:556,49:556,50:556,51:556,52:556,53:556,54:556,55:556,56:556,
57:556,58:278,59:278,60:584,61:584,62:584,63:556,64:1015,65:667,66:667,67:722,68:722,69:667,
70:611,71:778,72:722,73:278,74:500,75:667,76:556,77:833,78:722,79:778,80:667,81:778,82:722,
83:667,84:611,85:722,86:667,87:944,88:667,89:667,90:611,91:278,92:278,93:278,94:469,95:556,
96:333,97:556,98:556,99:500,100:556,101:556,102:278,103:556,104:556,105:222,106:222,107:500,
108:222,109:833,110:556,111:556,112:556,113:556,114:333,115:500,116:278,117:556,118:500,
119:722,120:500,121:500,122:500,123:334,124:260,125:334,126:584}
HELVB = {32:278,33:333,34:474,35:556,36:556,37:889,38:722,39:238,40:333,41:333,42:389,43:584,
44:278,45:333,46:278,47:278,48:556,49:556,50:556,51:556,52:556,53:556,54:556,55:556,56:556,
57:556,58:333,59:333,60:584,61:584,62:584,63:611,64:975,65:722,66:722,67:722,68:722,69:667,
70:611,71:778,72:722,73:278,74:556,75:722,76:611,77:833,78:722,79:778,80:667,81:778,82:722,
83:667,84:611,85:722,86:667,87:944,88:667,89:667,90:611,91:333,92:278,93:333,94:584,95:556,
96:333,97:556,98:611,99:556,100:611,101:556,102:333,103:611,104:611,105:278,106:278,107:556,
108:278,109:889,110:611,111:611,112:611,113:611,114:389,115:556,116:333,117:611,118:556,
119:778,120:556,121:556,122:500,123:389,124:280,125:389,126:584}
# WinAnsi high codes actually used
for _t, _m in ((HELV, {0x91:222,0x92:222,0x93:333,0x94:333,0x95:350,0x96:556,0x97:1000,0xB7:278,0x85:1000,0xA0:278}),
               (HELVB,{0x91:278,0x92:278,0x93:500,0x94:500,0x95:350,0x96:556,0x97:1000,0xB7:278,0x85:1000,0xA0:278})):
    _t.update(_m)
COUR = {c: 600 for c in range(32, 256)}

FONTS = {"R": ("F1", HELV), "B": ("F2", HELVB), "I": ("F3", HELV), "C": ("F4", COUR)}

# unicode -> WinAnsi byte
U2W = {'—':0x97, '–':0x96, '‘':0x91, '’':0x92, '“':0x93,
       '”':0x94, '•':0x95, '·':0xB7, '…':0x85, ' ':0x20,
       '‑':0x2D, '−':0x2D, '×':0x78, '→':0x3E}

def enc(s):
    out = bytearray()
    for ch in s:
        o = ord(ch)
        if o < 128: out.append(o)
        elif ch in U2W: out.append(U2W[ch])
        elif o < 256: out.append(o)
        else: out.append(0x3F)
    return bytes(out)

def wid(s, style, size):
    tbl = FONTS[style][1]
    return sum(tbl.get(b, 556) for b in enc(s)) * size / 1000.0

def esc(b):
    return b.replace(b'\\', b'\\\\').replace(b'(', b'\\(').replace(b')', b'\\)')

# ---------------------------------------------------------------- HTML -> runs
TAGRE = re.compile(r'<(/?)(\w+)([^>]*)>')

def runs_of(frag):
    """Turn an inline HTML fragment into [(text, style)] with style in R/B/C."""
    out, stack, pos = [], ['R'], 0
    for m in TAGRE.finditer(frag):
        txt = frag[pos:m.start()]
        if txt: out.append((html.unescape(txt), stack[-1]))
        closing, tag = m.group(1), m.group(2).lower()
        if not closing:
            if tag in ('b', 'strong'): stack.append('B')
            elif tag == 'code': stack.append('C')
            elif tag == 'em': stack.append('I')
        else:
            if tag in ('b', 'strong', 'code', 'em') and len(stack) > 1: stack.pop()
        pos = m.end()
    txt = frag[pos:]
    if txt: out.append((html.unescape(txt), stack[-1]))
    return [(re.sub(r'\s+', ' ', t), s) for t, s in out if t.strip() or t == ' ']

def strip(frag):
    return re.sub(r'\s+', ' ', html.unescape(re.sub(r'<[^>]+>', '', frag))).strip()

# ---------------------------------------------------------------- PDF writer
class PDF:
    def __init__(self):
        self.pages, self.buf, self.links = [], [], []
        self.y = TOP
        self.newpage()

    def newpage(self):
        if self.buf: self.pages.append((b''.join(self.buf), self.links))
        self.buf, self.links = [], []
        self.y = TOP

    def col(self, c):
        self.buf.append(("%.3f %.3f %.3f rg\n" % c).encode())

    def text(self, x, y, s, style, size, color):
        if not s: return
        self.col(color)
        self.buf.append(b"BT /" + FONTS[style][0].encode() + (" %.2f Tf %.2f %.2f Td (" % (size, x, y)).encode()
                        + esc(enc(s)) + b") Tj ET\n")

    def line(self, x1, y1, x2, y2, c, w=0.5):
        self.buf.append(("%.3f %.3f %.3f RG %.2f w %.2f %.2f m %.2f %.2f l S\n"
                         % (c[0], c[1], c[2], w, x1, y1, x2, y2)).encode())

    def rect(self, x, y, w, h, c):
        self.col(c)
        self.buf.append(("%.2f %.2f %.2f %.2f re f\n" % (x, y, w, h)).encode())

    def link(self, x, y, w, h, uri):
        self.links.append((x, y, w, h, uri))

    def space(self, need):
        if self.y - need < BOT:
            self.newpage()
            return True
        return False

    # --- wrapped rich text -------------------------------------------------
    def para(self, runs, x, width, size, color, lead=1.36, indent=0, bullet=None):
        words = []
        for t, st in runs:
            parts = re.split(r'(\s+)', t)
            for p in parts:
                if p: words.append((p, st))
        lines, cur, curw = [], [], 0.0
        avail = width - indent
        for w_, st in words:
            ww = wid(w_, st, size)
            if w_.isspace():
                if cur: cur.append((w_, st)); curw += ww
                continue
            if curw + ww > avail and cur:
                while cur and cur[-1][0].isspace(): cur.pop()
                lines.append(cur); cur, curw = [], 0.0
            cur.append((w_, st)); curw += ww
        if cur:
            while cur and cur[-1][0].isspace(): cur.pop()
            lines.append(cur)
        lh = size * lead
        for i, ln in enumerate(lines):
            self.space(lh)
            if i == 0 and bullet:
                self.text(x, self.y - size, bullet[0], 'R', size, bullet[1])
            cx = x + (indent if (bullet or indent) else 0)
            merged = []
            for t, st in ln:
                if merged and merged[-1][1] == st: merged[-1][0] += t
                else: merged.append([t, st])
            for t, st in merged:
                self.text(cx, self.y - size, t, st, size,
                          CODEC if st == 'C' else color)
                cx += wid(t, st, size)
            self.y -= lh
        return len(lines)

    def out(self):
        if self.buf: self.pages.append((b''.join(self.buf), self.links))
        objs, def_ = {}, []
        def add(n, body): objs[n] = body

        npages = len(self.pages)
        kids = " ".join("%d 0 R" % (4 + i) for i in range(npages))
        add(1, b"<< /Type /Catalog /Pages 2 0 R >>")
        add(2, ("<< /Type /Pages /Count %d /Kids [%s] >>" % (npages, kids)).encode())
        add(3, b"<< /Font << /F1 100 0 R /F2 101 0 R /F3 102 0 R /F4 103 0 R >> >>")
        for i, (nm, base) in enumerate([("F1","Helvetica"),("F2","Helvetica-Bold"),
                                        ("F3","Helvetica-Oblique"),("F4","Courier")]):
            add(100 + i, ("<< /Type /Font /Subtype /Type1 /BaseFont /%s /Encoding /WinAnsiEncoding >>" % base).encode())
        nxt = 200
        for i, (stream, links) in enumerate(self.pages):
            comp = zlib.compress(stream)
            cid = 4 + npages + i
            annots = ""
            if links:
                ids = []
                for (x, y, w, h, uri) in links:
                    add(nxt, ("<< /Type /Annot /Subtype /Link /Border [0 0 0] /Rect [%.2f %.2f %.2f %.2f] "
                              "/A << /S /URI /URI (%s) >> >>" % (x, y, x + w, y + h, uri)).encode())
                    ids.append("%d 0 R" % nxt); nxt += 1
                annots = " /Annots [%s]" % " ".join(ids)
            add(4 + i, ("<< /Type /Page /Parent 2 0 R /MediaBox [0 0 %.3f %.3f] /Resources 3 0 R "
                        "/Contents %d 0 R%s >>" % (PW, PH, cid, annots)).encode())
            add(cid, b"<< /Length %d /Filter /FlateDecode >>\nstream\n" % len(comp) + comp + b"\nendstream")
        add(nxt, b"<< /Title (Rishi Sharma \\226 Senior Backend & Full-Stack Engineer) "
                 b"/Author (Rishi Sharma) /Creator (resume build) >>")
        info = nxt

        buf = bytearray(b"%PDF-1.4\n%\xe2\xe3\xcf\xd3\n")
        offs = {}
        for n in sorted(objs):
            offs[n] = len(buf)
            buf += ("%d 0 obj\n" % n).encode() + objs[n] + b"\nendobj\n"
        mx = max(objs) + 1
        xref = len(buf)
        buf += ("xref\n0 %d\n" % mx).encode() + b"0000000000 65535 f \n"
        for n in range(1, mx):
            buf += (("%010d 00000 n \n" % offs[n]) if n in offs else "0000000000 65535 f \n").encode()
        buf += ("trailer\n<< /Size %d /Root 1 0 R /Info %d 0 R >>\nstartxref\n%d\n%%%%EOF\n"
                % (mx, info, xref)).encode()
        return bytes(buf)

# ---------------------------------------------------------------- build
def build():
    src = open(SRC, encoding="utf-8").read()
    body = src.split("</style>", 1)[1]
    sheets = re.split(r'<div class="sheet">', body)[1:]
    p = PDF()

    for si, sheet in enumerate(sheets):
        if si: p.newpage()

        # ---- masthead (page 1 only) ----
        m = re.search(r'<h1>(.*?)</h1>', sheet, re.S)
        if m:
            name = strip(m.group(1))
            first, _, last = name.partition(" ")
            p.text(M, p.y - 26, first + " ", 'B', 26, INK)
            p.text(M + wid(first + " ", 'B', 26), p.y - 26, last, 'R', 26, INK2)
            p.y -= 32
            role = strip(re.search(r'<p class="role">(.*?)</p>', sheet, re.S).group(1))
            p.para([(role, 'B')], M, CW, 10.6, ACC); p.y -= 3

            contact = re.search(r'<p class="contact">(.*?)</p>', sheet, re.S).group(1)
            l1 = contact.split("<br>")[0]
            p.para(runs_of(l1), M, CW, 8.9, INK2, lead=1.45)
            # link row
            lx = M
            for href, label in re.findall(r'<a class="lnk" href="([^"]+)">([^<]+)</a>', contact):
                w = wid(label, 'B', 8.9)
                p.text(lx, p.y - 8.9, label, 'B', 8.9, ACC)
                p.link(lx, p.y - 10.5, w, 11, href)
                lx += w
                sep = "   |   "
                p.text(lx, p.y - 8.9, sep, 'R', 8.9, RULE)
                lx += wid(sep, 'R', 8.9)
            p.y -= 8.9 * 1.45 + 6
            em = re.search(r'href="mailto:([^"]+)"', contact)
            if em: p.link(M, p.y + 34, wid(em.group(1), 'R', 8.9), 11, "mailto:" + em.group(1))

        # ---- sections ----
        for sec in re.findall(r'<section[^>]*>(.*?)</section>', sheet, re.S):
            h2 = re.search(r'<h2>(.*?)</h2>', sec, re.S)
            if h2:
                p.space(26)
                p.y -= 4
                p.text(M, p.y - 8.5, strip(h2.group(1)).upper(), 'B', 8.5, ACC)
                p.y -= 11.0
                p.line(M, p.y + 1, M + CW, p.y + 1, RULE)
                p.y -= 4

            # summary
            sm = re.search(r'<p class="summary">(.*?)</p>', sec, re.S)
            if sm:
                p.para(runs_of(sm.group(1)), M, CW, 9.9, INK2, lead=1.47)

            # skills rows
            rows = re.findall(r'<div class="row"><dt>(.*?)</dt><dd>(.*?)</dd></div>', sec, re.S)
            for dt, dd in rows:
                p.space(16)
                top = p.y
                p.text(M, p.y - 8.4, strip(dt).upper(), 'B', 8.4, INK3)
                n = p.para(runs_of(dd), M + 96, CW - 96, 9.5, INK2, lead=1.34)
                p.y = min(p.y, top - max(13, n * 9.5 * 1.34 + 3))
                p.line(M, p.y + 3, M + CW, p.y + 3, RULE2, 0.4)

            # jobs
            for job in re.findall(r'<div class="job">(.*?)\n    </div>', sec, re.S):
                p.space(40)
                p.y -= 3
                co = strip(re.search(r'<div class="job-co">(.*?)</div>', job, re.S).group(1))
                wh = strip(re.search(r'<div class="job-when">(.*?)</div>', job, re.S).group(1))
                p.text(M, p.y - 11, co, 'B', 11, INK)
                p.text(M + CW - wid(wh, 'B', 8.7), p.y - 11, wh, 'B', 8.7, INK3)
                p.y -= 14
                rl = re.search(r'<div class="job-role">(.*?)</div>', job, re.S)
                if rl:
                    rr = re.sub(r'<span class="job-where">.*?</span>', '', rl.group(1), flags=re.S)
                    where = re.search(r'<span class="job-where">(.*?)</span>', rl.group(1), re.S)
                    p.text(M, p.y - 9.7, strip(rr), 'B', 9.7, ACC)
                    if where:
                        p.text(M + wid(strip(rr) + " ", 'B', 9.7), p.y - 9.7, " " + strip(where.group(1)), 'R', 8.7, INK3)
                    p.y -= 12

                for st in re.findall(r'<div class="stream">(.*?)\n      </div>', job, re.S):
                    p.space(34)
                    p.y -= 3
                    ytop = p.y
                    nm = re.search(r'<div class="stream-name">(.*?)</div>', st, re.S).group(1)
                    base = strip(re.sub(r'<span class="desc">.*?</span>', '', nm, flags=re.S))
                    desc = re.search(r'<span class="desc">(.*?)</span>', nm, re.S)
                    when = re.search(r'<div class="stream-when">(.*?)</div>', st, re.S)
                    x0 = M + 9
                    p.text(x0, p.y - 9.7, base, 'B', 9.7, INK)
                    if desc:
                        p.text(x0 + wid(base + " ", 'B', 9.7), p.y - 9.7, " " + strip(desc.group(1)), 'R', 9.3, INK3)
                    if when:
                        w = strip(when.group(1))
                        p.text(M + CW - wid(w, 'B', 8.4), p.y - 9.7, w, 'B', 8.4, INK3)
                    p.y -= 12
                    tech = re.search(r'<p class="stream-tech">(.*?)</p>', st, re.S)
                    if tech:
                        p.para([(strip(tech.group(1)), 'C')], x0, CW - 9, 8.0, INK3, lead=1.3)
                        p.y -= 2
                    for li in re.findall(r'<li>(.*?)</li>', st, re.S):
                        p.para(runs_of(li), x0, CW - 9, 9.5, INK2, lead=1.4,
                               indent=9, bullet=("•", ACC))
                        p.y -= 1.8
                    p.rect(M + 2.5, p.y + 4, 1.4, ytop - p.y - 4, ACC)

            # two-column item grids (education / certifications)
            g = re.search(r'<div class="grid2">(.*?)</div>\s*</section>', sec + "</section>", re.S)
            if g and 'class="item"' in g.group(1):
                cols = re.findall(r'<div>\s*(.*?)\s*</div>\s*(?=<div>|$)', g.group(1), re.S)
                items = re.findall(r'<div class="item">(.*?)</div>\s*</div>', g.group(1) + "</div>", re.S)
                items = re.findall(r'<div class="item">(.*?)(?=<div class="item">|\Z)', g.group(1), re.S)
                p.space(30)
                ytop = p.y
                ncol = max(1, min(3, len(items)))
                gap = 18
                half = (CW - gap * (ncol - 1)) / ncol
                low = p.y
                for idx, it in enumerate(items[:ncol]):
                    x = M + idx * (half + gap)
                    p.y = ytop
                    t = re.search(r'<div class="t">(.*?)</div>', it, re.S)
                    s_ = re.search(r'<div class="s">(.*?)</div>', it, re.S)
                    d_ = re.search(r'<div class="d">(.*?)</div>', it, re.S)
                    if t: p.para([(strip(t.group(1)), 'B')], x, half, 9.6, INK, lead=1.3)
                    if s_: p.para([(strip(s_.group(1)), 'R')], x, half, 8.8, INK3, lead=1.35)
                    if d_: p.para([(strip(d_.group(1)), 'R')], x, half, 9.2, INK2, lead=1.35)
                    low = min(low, p.y)
                p.y = low - 2

    data = p.out()
    open(OUT, "wb").write(data)
    return data, len(p.pages)

if __name__ == "__main__":
    data, n = build()
    print("wrote %s  (%d pages, %.1f KB)" % (OUT, n, len(data) / 1024))
