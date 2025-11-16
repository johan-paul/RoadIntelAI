RoadIntelAI+ — AI-Driven Cost Intelligence Engine for Road Safety Interventions
By TECH VIRUS

Johan Paul D, Harene Mohanram
Sri Krishna College of Engineering and Technology

🚦 Overview

RoadIntelAI+ is an AI-driven system designed to automatically extract road safety interventions from engineering reports, map them to standard specifications, fetch official material prices, and generate transparent, procurement-ready cost estimates.

The system functions as a hybrid Python backend and React frontend with automated rule-based, NLP, and catalog-driven intelligence pipelines.

🎯 Problem Statement

Government engineering departments often struggle with:

Unstructured reports (PDF/CSV)

Non-standard safety intervention naming

Difficulty locating relevant IRC/CPWD specifications

Manual price lookup from CPWD SOR or GeM

Delays in producing Bill of Materials (BoM)

RoadIntelAI+ solves this by providing a fully automated pipeline that extracts interventions, maps them to standard SKUs, fetches official prices, and produces accurate, auditable cost estimates.

🚀 Key Features
1️⃣ Intervention Extraction

Automatically identifies road safety components such as:

Signages

Markings

Signals

Pavement elements

Road furniture

From uploaded PDFs, reports, tables, or documents.

2️⃣ Specification Mapping

Links each intervention to:

Relevant IRC clauses

Standard CPWD/GeM item specifications

Correct material descriptions

Ensures accuracy and compliance with national standards.

3️⃣ Official Price Retrieval

Retrieves material-only prices using a tiered strategy:

Price Resolution Engine

GeM (Live Prices) → high confidence
CPWD SOR/AOR (Fallback) → medium confidence

Includes:

Recency-based price selection

Outlier filtering

Transparent source lineage

4️⃣ Cost Estimate Generation

Generates a complete, item-wise BoM with:

SKU

Clause reference

Unit price source (GeM/CPWD)

Assumptions

Quantity scaling

Final cost

Outputs are procurement-ready.

⚙️ How the System Works
📥 1. Ingestion & Parsing

Reads PDFs, DOCs, tables, and CSVs

Extracts text, structured tables, quantities, and location cues

Uses rule-based logic + NLP heuristics

📦 2. Canonical Schema Mapping

All extracted information is standardized to a common schema:

type
quantity
unit
spec_ref
context


This unifies all input sources for downstream processing.

🔍 3. Normalization & SKU Mapping

Maps interventions to official SKUs using:

Exact matching

Fuzzy matching

Keyword expansion

Clause-anchored lookup

Rule-based aliasing

💰 4. Price Resolution Engine

A multi-source pricing engine:

▶ Step 1: GEM Live Fetch

Pulls live pricing + URLs

▶ Step 2: CPWD Fallback

If GEM fails or is missing, CPWD SOR/AOR prices are used

▶ Step 3: Outlier Filtering & Recency Check

Ensures realistic pricing

🧮 5. Cost Computation

Quantity × Unit Price

MOQ handling

Pack-size normalization

Location multipliers

Price tiering based on confidence

📊 Additional Intelligence Features
📈 Cost vs Safety Gain Curve

Visualizes:

Safety improvement vs investment

Optimal intervention bundles

Diminishing returns

Helps authorities invest where impact is highest.

🏆 IPS Ranking (Intervention Prioritization System)

Ranks interventions based on:

Safety impact

Urgency

Cost efficiency

Enables data-led decision-making.

📄 BoM Export

Generates a complete, auditor-friendly Bill of Materials:

SKU

Clause reference

Item description

Unit

Quantity

Unit price

Total cost

Source & lineage

Ready for procurement and tendering.

🏗️ System Architecture
PDF/CSV Input
     ↓
Ingestion & Parsing Engine
     ↓
Canonical Schema Mapper
     ↓
SKU Normalizer + Rule Engine
     ↓
Price Resolution Engine (GEM → CPWD)
     ↓
Cost Computation
     ↓
Safety Gain + IPS Ranking
     ↓
BoM Generator + UI Dashboard

🎥 Demo Video

Watch full project demo here:
👉 https://youtu.be/76nA8OlTG9Y

💻 Tech Stack
Backend

Python

FastAPI/Flask

NLP + Rule-based extractors

PDF parsing utilities

Frontend

React (Vite)

Tailwind / CSS

REST API integration

Data Sources

GeM Marketplace

CPWD SOR/AOR

IRC Standards

🛠️ Install & Run
Backend Setup
pip install -r requirements.txt
python app.py

Frontend Setup
cd roadintel-ui
npm install
npm run dev

🧾 Repository Structure
ROADINTELAI/
│
├── core/
│   ├── fetchers/
│   ├── models.py
│   ├── rules.py
│   ├── estimator.py
│   ├── parser_pdf.py
│   ├── utils.py
│   └── data/
│       ├── cpwd_rates.json
│       ├── mapping_keywords.json
│
├── roadintel-ui/   (React Frontend)
├── requirements.txt
├── README.md
└── app.py

🙏 Acknowledgement

This project was built as part of the
National Road Safety Hackathon 2025
Organized by Centre of Excellence for Road Safety (CoERS), IIT Madras.

🎉 Thank You!

For any queries, collaborations, or contributions — feel free to open an issue or pull request.