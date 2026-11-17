"""Step 1 of the data pipeline: pull every Chicago, IL filing out of the DOL files.

The DOL publishes Labor Condition Application (LCA) filings each quarter as large
.xlsx files (80-145 MB each). This reads them as a stream and keeps only the rows
whose main worksite is Chicago, IL, with the columns Patrocinio uses.

Usage:
  python3 scripts/extract_filings.py <file.xlsx> [<file.xlsx> ...] > data/chicago_filings.csv

The raw .xlsx files stay out of git (see .gitignore); this script is how to rebuild.
"""
import csv
import sys

import openpyxl

KEEP = [
    "CASE_NUMBER", "CASE_STATUS", "DECISION_DATE", "VISA_CLASS", "JOB_TITLE",
    "SOC_CODE", "SOC_TITLE", "EMPLOYER_NAME", "TRADE_NAME_DBA", "EMPLOYER_FEIN",
    "WORKSITE_CITY", "WORKSITE_STATE", "TOTAL_WORKER_POSITIONS",
    "WAGE_RATE_OF_PAY_FROM", "WAGE_UNIT_OF_PAY", "PW_WAGE_LEVEL",
]


def rows(path):
    wb = openpyxl.load_workbook(path, read_only=True)
    ws = wb[wb.sheetnames[0]]
    it = ws.iter_rows(values_only=True)
    header = next(it)
    idx = {name: header.index(name) for name in KEEP}
    for row in it:
        yield {name: row[i] for name, i in idx.items()}


def main(paths):
    out = csv.DictWriter(sys.stdout, fieldnames=KEEP + ["SOURCE_FILE"])
    out.writeheader()
    for path in paths:
        seen = kept = 0
        for r in rows(path):
            seen += 1
            city = str(r["WORKSITE_CITY"] or "").strip().upper()
            state = str(r["WORKSITE_STATE"] or "").strip().upper()
            if city != "CHICAGO" or state != "IL":
                continue
            if r["DECISION_DATE"] is not None and hasattr(r["DECISION_DATE"], "date"):
                r["DECISION_DATE"] = r["DECISION_DATE"].date().isoformat()
            r["SOURCE_FILE"] = path.rsplit("/", 1)[-1]
            out.writerow(r)
            kept += 1
        print(f"{path}: {seen} filings read, {kept} in Chicago, IL", file=sys.stderr)


if __name__ == "__main__":
    main(sys.argv[1:])
