import React, { useState, useEffect } from "react";
import Plot from "./Plot";

/* ------------------------------------------------------------------
   SAMPLE_ESTIMATE (full JSON) — paste exactly as provided earlier.
   ------------------------------------------------------------------ */
const SAMPLE_ESTIMATE = {
  "items": [
    {
      "intervention_id": "R1",
      "sku": "SIGN_SPEED_LIMIT_600MM",
      "description": "Speed limit sign, 600mm, RA2",
      "clause": "IRC:67-202 2",
      "clause_url": "https://law.resource.org/pub/in/bis/manifest.irc.html",
      "unit": "nos",
      "quantity": 1,
      "unit_price": 3500,
      "total_price": 3500,
      "price_source": "CPWD Catalog",
      "assumptions": "Assume one sign per location. Live GeM price unavailable; fallback to CPWD catalog."
    },
    {
      "intervention_id": "R2",
      "sku": "SIGN_SCHOOL_AHEAD_600MM",
      "description": "School ahead sign, 600mm, RA2",
      "clause": "IRC: 67",
      "clause_url": "https://law.resource.org/pub/in/bis/manifest.irc.html",
      "unit": "nos",
      "quantity": 1,
      "unit_price": 3200,
      "total_price": 3200,
      "price_source": "CPWD Catalog",
      "assumptions": "Assume one sign per location. Live GeM price unavailable; fallback to CPWD catalog."
    },
    {
      "intervention_id": "R3",
      "sku": "SIGN_FUEL_PUMP_600MM",
      "description": "Fuel pump informatory sign, 600mm, RA2",
      "clause": "IRC: 67",
      "clause_url": "https://law.resource.org/pub/in/bis/manifest.irc.html",
      "unit": "nos",
      "quantity": 1,
      "unit_price": 3000,
      "total_price": 3000,
      "price_source": "CPWD Catalog",
      "assumptions": "Assume one sign per location. Live GeM price unavailable; fallback to CPWD catalog."
    },
    {
      "intervention_id": "R4",
      "sku": "SIGN_SIDE_ROAD_AHEAD_600MM",
      "description": "Side road ahead sign, 600mm, RA2",
      "clause": "IRC: 67",
      "clause_url": "https://law.resource.org/pub/in/bis/manifest.irc.html",
      "unit": "nos",
      "quantity": 1,
      "unit_price": 3300,
      "total_price": 3300,
      "price_source": "CPWD Catalog",
      "assumptions": "Assume one sign per location. Live GeM price unavailable; fallback to CPWD catalog."
    },
    {
      "intervention_id": "R5",
      "sku": "SIGN_NO_PARKING_600MM",
      "description": "No Parking sign, 600mm, RA2",
      "clause": "IRC: 67",
      "clause_url": "https://law.resource.org/pub/in/bis/manifest.irc.html",
      "unit": "nos",
      "quantity": 1,
      "unit_price": 3100,
      "total_price": 3100,
      "price_source": "CPWD Catalog",
      "assumptions": "Assume one sign per location. Live GeM price unavailable; fallback to CPWD catalog."
    },
    {
      "intervention_id": "R6",
      "sku": "SIGN_PEDESTRIAN_CROSSING_600MM",
      "description": "Pedestrian crossing sign, 600mm, RA2",
      "clause": "IRC:67-202 2",
      "clause_url": "https://law.resource.org/pub/in/bis/manifest.irc.html",
      "unit": "nos",
      "quantity": 1,
      "unit_price": 3300,
      "total_price": 3300,
      "price_source": "CPWD Catalog",
      "assumptions": "Assume one sign per location. Live GeM price unavailable; fallback to CPWD catalog."
    },
    {
      "intervention_id": "R7",
      "sku": "SIGN_PEDESTRIAN_CROSSING_600MM",
      "description": "Pedestrian crossing sign, 600mm, RA2",
      "clause": "IRC:67-202 2",
      "clause_url": "https://law.resource.org/pub/in/bis/manifest.irc.html",
      "unit": "nos",
      "quantity": 1,
      "unit_price": 3300,
      "total_price": 3300,
      "price_source": "CPWD Catalog",
      "assumptions": "Assume one sign per location. Live GeM price unavailable; fallback to CPWD catalog."
    },
    {
      "intervention_id": "R1",
      "sku": "MARK_LONGITUDINAL_REPAINT",
      "description": "Repainting longitudinal markings, thermoplastic",
      "clause": "IRC:35-201 5",
      "clause_url": "https://law.resource.org/pub/in/bis/manifest.irc.html",
      "unit": "m",
      "quantity": 200,
      "unit_price": 25,
      "total_price": 5000,
      "price_source": "CPWD Catalog",
      "assumptions": "Length parsed as 200.0 m. Live GeM price unavailable; fallback to CPWD catalog."
    },
    {
      "intervention_id": "R2",
      "sku": "MARK_LONGITUDINAL_REPAINT",
      "description": "Repainting longitudinal markings, thermoplastic",
      "clause": "IRC:35-201 5",
      "clause_url": "https://law.resource.org/pub/in/bis/manifest.irc.html",
      "unit": "m",
      "quantity": 3.5,
      "unit_price": 25,
      "total_price": 87.5,
      "price_source": "CPWD Catalog",
      "assumptions": "Length parsed as 3.5 m. Live GeM price unavailable; fallback to CPWD catalog."
    },
    {
      "intervention_id": "R3",
      "sku": "STUD_RETRO_BIDIR",
      "description": "Retroreflective red-white bidirectional road stud",
      "clause": "IRC:35-201 5",
      "clause_url": "https://law.resource.org/pub/in/bis/manifest.irc.html",
      "unit": "nos",
      "quantity": 20,
      "unit_price": 120,
      "total_price": 2400,
      "price_source": "CPWD Catalog",
      "assumptions": "Assume 20 studs per short segment at 10 m spacing. Live GeM price unavailable; fallback to CPWD catalog."
    },
    {
      "intervention_id": "R4",
      "sku": "MARK_PEDESTRIAN_CROSSING",
      "description": "Pedestrian crossing thermoplastic marking",
      "clause": "IRC:SP:73-2018 11.3",
      "clause_url": "https://law.resource.org/pub/in/bis/manifest.irc.html",
      "unit": "m2",
      "quantity": 12,
      "unit_price": 500,
      "total_price": 6000,
      "price_source": "CPWD Catalog",
      "assumptions": "Assume 12 m² per crossing for a single approach. Live GeM price unavailable; fallback to CPWD catalog."
    },
    {
      "intervention_id": "P1",
      "sku": "POTHOLE_PATCH_20MM",
      "description": "Pothole patching 20mm depth (material only)",
      "clause": "IRC:82-202 3",
      "clause_url": "https://law.resource.org/pub/in/bis/manifest.irc.html",
      "unit": "m2",
      "quantity": 2.5,
      "unit_price": 400,
      "total_price": 1000,
      "price_source": "CPWD Catalog",
      "assumptions": "Area parsed as 2.5 m². Live GeM price unavailable; fallback to CPWD catalog."
    },
    {
      "intervention_id": "P2",
      "sku": "UNKNOWN",
      "description": "Unknown item (add rule)",
      "clause": null,
      "clause_url": null,
      "unit": "nos",
      "quantity": 1,
      "unit_price": 0,
      "total_price": 0,
      "price_source": "Unknown",
      "assumptions": "No mapping rule matched; requires SKU rule addition."
    },
    {
      "intervention_id": "P3",
      "sku": "SOLAR_BLINKER_REPAIR",
      "description": "Repair/replace solar blinker module (material only)",
      "clause": "IRC: 93",
      "clause_url": "https://law.resource.org/pub/in/bis/manifest.irc.html",
      "unit": "nos",
      "quantity": 1,
      "unit_price": 5000,
      "total_price": 5000,
      "price_source": "CPWD Catalog",
      "assumptions": "Assume one blinker module per location. Live GeM price unavailable; fallback to CPWD catalog."
    },
    {
      "intervention_id": "P4",
      "sku": "UNKNOWN",
      "description": "Unknown item (add rule)",
      "clause": null,
      "clause_url": null,
      "unit": "nos",
      "quantity": 1,
      "unit_price": 0,
      "total_price": 0,
      "price_source": "Unknown",
      "assumptions": "No mapping rule matched; requires SKU rule addition."
    },
    {
      "intervention_id": "P5",
      "sku": "STREETLIGHT_LED_90W",
      "description": "LED streetlight 90W (material only)",
      "clause": "IRC:SP:73-201 8",
      "clause_url": "https://law.resource.org/pub/in/bis/manifest.irc.html",
      "unit": "nos",
      "quantity": 10,
      "unit_price": 8000,
      "total_price": 80000,
      "price_source": "CPWD Catalog",
      "assumptions": "Assume 10 streetlights for stretch in prototype. Live GeM price unavailable; fallback to CPWD catalog."
    },
    {
      "intervention_id": "P6",
      "sku": "UNKNOWN",
      "description": "Unknown item (add rule)",
      "clause": null,
      "clause_url": null,
      "unit": "nos",
      "quantity": 1,
      "unit_price": 0,
      "total_price": 0,
      "price_source": "Unknown",
      "assumptions": "No mapping rule matched; requires SKU rule addition."
    },
    {
      "intervention_id": "P7",
      "sku": "FMM_BRIDGE",
      "description": "FMM for minor bridge (retroreflective markers)",
      "clause": "IRC:79- 2019",
      "clause_url": "https://law.resource.org/pub/in/bis/manifest.irc.html",
      "unit": "nos",
      "quantity": 16,
      "unit_price": 250,
      "total_price": 4000,
      "price_source": "CPWD Catalog",
      "assumptions": "Assume 16 markers for minor bridge length 16 m. Live GeM price unavailable; fallback to CPWD catalog."
    },
    {
      "intervention_id": "R1",
      "sku": "DELINEATOR_POLE",
      "description": "Delineator/guide pole with RA2 sheeting",
      "clause": "IRC:79-2019 3",
      "clause_url": "https://law.resource.org/pub/in/bis/manifest.irc.html",
      "unit": "nos",
      "quantity": 20,
      "unit_price": 300,
      "total_price": 6000,
      "price_source": "CPWD Catalog",
      "assumptions": "Assume 20 delineators on curve section. Live GeM price unavailable; fallback to CPWD catalog."
    }
  ],
  "bom": [
    {
      "sku": "SIGN_SPEED_LIMIT_600MM",
      "description": "Speed limit sign, 600mm, RA2",
      "unit": "nos",
      "total_quantity": 1,
      "unit_price": 3500,
      "total_price": 3500,
      "price_source": "CPWD Catalog"
    },
    {
      "sku": "SIGN_SCHOOL_AHEAD_600MM",
      "description": "School ahead sign, 600mm, RA2",
      "unit": "nos",
      "total_quantity": 1,
      "unit_price": 3200,
      "total_price": 3200,
      "price_source": "CPWD Catalog"
    },
    {
      "sku": "SIGN_FUEL_PUMP_600MM",
      "description": "Fuel pump informatory sign, 600mm, RA2",
      "unit": "nos",
      "total_quantity": 1,
      "unit_price": 3000,
      "total_price": 3000,
      "price_source": "CPWD Catalog"
    },
    {
      "sku": "SIGN_SIDE_ROAD_AHEAD_600MM",
      "description": "Side road ahead sign, 600mm, RA2",
      "unit": "nos",
      "total_quantity": 1,
      "unit_price": 3300,
      "total_price": 3300,
      "price_source": "CPWD Catalog"
    },
    {
      "sku": "SIGN_NO_PARKING_600MM",
      "description": "No Parking sign, 600mm, RA2",
      "unit": "nos",
      "total_quantity": 1,
      "unit_price": 3100,
      "total_price": 3100,
      "price_source": "CPWD Catalog"
    },
    {
      "sku": "SIGN_PEDESTRIAN_CROSSING_600MM",
      "description": "Pedestrian crossing sign, 600mm, RA2",
      "unit": "nos",
      "total_quantity": 2,
      "unit_price": 3300,
      "total_price": 6600,
      "price_source": "CPWD Catalog"
    },
    {
      "sku": "MARK_LONGITUDINAL_REPAINT",
      "description": "Repainting longitudinal markings, thermoplastic",
      "unit": "m",
      "total_quantity": 203.5,
      "unit_price": 25,
      "total_price": 5087.5,
      "price_source": "CPWD Catalog"
    },
    {
      "sku": "STUD_RETRO_BIDIR",
      "description": "Retroreflective red-white bidirectional road stud",
      "unit": "nos",
      "total_quantity": 20,
      "unit_price": 120,
      "total_price": 2400,
      "price_source": "CPWD Catalog"
    },
    {
      "sku": "MARK_PEDESTRIAN_CROSSING",
      "description": "Pedestrian crossing thermoplastic marking",
      "unit": "m2",
      "total_quantity": 12,
      "unit_price": 500,
      "total_price": 6000,
      "price_source": "CPWD Catalog"
    },
    {
      "sku": "POTHOLE_PATCH_20MM",
      "description": "Pothole patching 20mm depth (material only)",
      "unit": "m2",
      "total_quantity": 2.5,
      "unit_price": 400,
      "total_price": 1000,
      "price_source": "CPWD Catalog"
    },
    {
      "sku": "SOLAR_BLINKER_REPAIR",
      "description": "Repair/replace solar blinker module (material only)",
      "unit": "nos",
      "total_quantity": 1,
      "unit_price": 5000,
      "total_price": 5000,
      "price_source": "CPWD Catalog"
    },
    {
      "sku": "STREETLIGHT_LED_90W",
      "description": "LED streetlight 90W (material only)",
      "unit": "nos",
      "total_quantity": 10,
      "unit_price": 8000,
      "total_price": 80000,
      "price_source": "CPWD Catalog"
    },
    {
      "sku": "FMM_BRIDGE",
      "description": "FMM for minor bridge (retroreflective markers)",
      "unit": "nos",
      "total_quantity": 16,
      "unit_price": 250,
      "total_price": 4000,
      "price_source": "CPWD Catalog"
    },
    {
      "sku": "DELINEATOR_POLE",
      "description": "Delineator/guide pole with RA2 sheeting",
      "unit": "nos",
      "total_quantity": 20,
      "unit_price": 300,
      "total_price": 6000,
      "price_source": "CPWD Catalog"
    }
  ],
  "ips": [
    {
      "intervention_id": "R2",
      "ips": 0.176503,
      "components": {
        "safety_gain": 9,
        "risk_severity": 1.32,
        "urgency_weight": 1.3,
        "cost": 87.5
      }
    },
    {
      "intervention_id": "P1",
      "ips": 0.00792,
      "components": {
        "safety_gain": 6,
        "risk_severity": 1.2,
        "urgency_weight": 1.1,
        "cost": 1000
      }
    },
    {
      "intervention_id": "R2",
      "ips": 0.006435,
      "components": {
        "safety_gain": 12,
        "risk_severity": 1.32,
        "urgency_weight": 1.3,
        "cost": 3200
      }
    },
    {
      "intervention_id": "R6",
      "ips": 0.003782,
      "components": {
        "safety_gain": 8,
        "risk_severity": 1.2,
        "urgency_weight": 1.3,
        "cost": 3300
      }
    },
    {
      "intervention_id": "R7",
      "ips": 0.003782,
      "components": {
        "safety_gain": 8,
        "risk_severity": 1.2,
        "urgency_weight": 1.3,
        "cost": 3300
      }
    },
    {
      "intervention_id": "R3",
      "ips": 0.003208,
      "components": {
        "safety_gain": 7,
        "risk_severity": 1.1,
        "urgency_weight": 1,
        "cost": 2400
      }
    },
    {
      "intervention_id": "R4",
      "ips": 0.003146,
      "components": {
        "safety_gain": 11,
        "risk_severity": 1.32,
        "urgency_weight": 1.3,
        "cost": 6000
      }
    },
    {
      "intervention_id": "R1",
      "ips": 0.003143,
      "components": {
        "safety_gain": 10,
        "risk_severity": 1.1,
        "urgency_weight": 1,
        "cost": 3500
      }
    },
    {
      "intervention_id": "R4",
      "ips": 0.00312,
      "components": {
        "safety_gain": 6,
        "risk_severity": 1.32,
        "urgency_weight": 1.3,
        "cost": 3300
      }
    },
    {
      "intervention_id": "P7",
      "ips": 0.00264,
      "components": {
        "safety_gain": 8,
        "risk_severity": 1.2,
        "urgency_weight": 1.1,
        "cost": 4000
      }
    },
    {
      "intervention_id": "R1",
      "ips": 0.00198,
      "components": {
        "safety_gain": 9,
        "risk_severity": 1.1,
        "urgency_weight": 1,
        "cost": 5000
      }
    },
    {
      "intervention_id": "P3",
      "ips": 0.001848,
      "components": {
        "safety_gain": 7,
        "risk_severity": 1.2,
        "urgency_weight": 1.1,
        "cost": 5000
      }
    },
    {
      "intervention_id": "R1",
      "ips": 0.00165,
      "components": {
        "safety_gain": 9,
        "risk_severity": 1.1,
        "urgency_weight": 1,
        "cost": 6000
      }
    },
    {
      "intervention_id": "R5",
      "ips": 0.001613,
      "components": {
        "safety_gain": 5,
        "risk_severity": 1,
        "urgency_weight": 1,
        "cost": 3100
      }
    },
    {
      "intervention_id": "R3",
      "ips": 0.001467,
      "components": {
        "safety_gain": 4,
        "risk_severity": 1.1,
        "urgency_weight": 1,
        "cost": 3000
      }
    },
    {
      "intervention_id": "P5",
      "ips": 0.000215,
      "components": {
        "safety_gain": 13,
        "risk_severity": 1.2,
        "urgency_weight": 1.1,
        "cost": 80000
      }
    },
    {
      "intervention_id": "P2",
      "ips": 0,
      "components": {
        "safety_gain": 5,
        "risk_severity": 1.2,
        "urgency_weight": 1.1,
        "cost": 0
      }
    },
    {
      "intervention_id": "P4",
      "ips": 0,
      "components": {
        "safety_gain": 5,
        "risk_severity": 1.2,
        "urgency_weight": 1.1,
        "cost": 0
      }
    },
    {
      "intervention_id": "P6",
      "ips": 0,
      "components": {
        "safety_gain": 5,
        "risk_severity": 1.2,
        "urgency_weight": 1.1,
        "cost": 0
      }
    }
  ],
  "summary": {
    "total_interventions": 19,
    "mapped_items": 16,
    "unknown_items": 3,
    "material_total_cost": 132187.5,
    "official_price_sources_used": [
      "CPWD Catalog"
    ]
  },
  "curve_data": [
    {
      "id": "R2",
      "cost": 87.5,
      "safety_gain": 9,
      "roi": 0.1029
    },
    {
      "id": "P1",
      "cost": 1000,
      "safety_gain": 6,
      "roi": 0.006
    },
    {
      "id": "R2",
      "cost": 3200,
      "safety_gain": 12,
      "roi": 0.0037
    },
    {
      "id": "R6",
      "cost": 3300,
      "safety_gain": 8,
      "roi": 0.0024
    },
    {
      "id": "R7",
      "cost": 3300,
      "safety_gain": 8,
      "roi": 0.0024
    },
    {
      "id": "R3",
      "cost": 2400,
      "safety_gain": 7,
      "roi": 0.0029
    },
    {
      "id": "R4",
      "cost": 6000,
      "safety_gain": 11,
      "roi": 0.0018
    },
    {
      "id": "R1",
      "cost": 3500,
      "safety_gain": 10,
      "roi": 0.0029
    },
    {
      "id": "R4",
      "cost": 3300,
      "safety_gain": 6,
      "roi": 0.0018
    },
    {
      "id": "P7",
      "cost": 4000,
      "safety_gain": 8,
      "roi": 0.002
    },
    {
      "id": "R1",
      "cost": 5000,
      "safety_gain": 9,
      "roi": 0.0018
    },
    {
      "id": "P3",
      "cost": 5000,
      "safety_gain": 7,
      "roi": 0.0014
    },
    {
      "id": "R1",
      "cost": 6000,
      "safety_gain": 9,
      "roi": 0.0015
    },
    {
      "id": "R5",
      "cost": 3100,
      "safety_gain": 5,
      "roi": 0.0016
    },
    {
      "id": "R3",
      "cost": 3000,
      "safety_gain": 4,
      "roi": 0.0013
    },
    {
      "id": "P5",
      "cost": 80000,
      "safety_gain": 13,
      "roi": 0.0002
    },
    {
      "id": "P2",
      "cost": 0,
      "safety_gain": 5,
      "roi": 0
    },
    {
      "id": "P4",
      "cost": 0,
      "safety_gain": 5,
      "roi": 0
    },
    {
      "id": "P6",
      "cost": 0,
      "safety_gain": 5,
      "roi": 0
    }
  ],
  "top_ips": [
    {
      "intervention_id": "R2",
      "ips": 0.176503,
      "components": {
        "safety_gain": 9,
        "risk_severity": 1.32,
        "urgency_weight": 1.3,
        "cost": 87.5
      }
    },
    {
      "intervention_id": "P1",
      "ips": 0.00792,
      "components": {
        "safety_gain": 6,
        "risk_severity": 1.2,
        "urgency_weight": 1.1,
        "cost": 1000
      }
    },
    {
      "intervention_id": "R2",
      "ips": 0.006435,
      "components": {
        "safety_gain": 12,
        "risk_severity": 1.32,
        "urgency_weight": 1.3,
        "cost": 3200
      }
    },
    {
      "intervention_id": "R6",
      "ips": 0.003782,
      "components": {
        "safety_gain": 8,
        "risk_severity": 1.2,
        "urgency_weight": 1.3,
        "cost": 3300
      }
    },
    {
      "intervention_id": "R7",
      "ips": 0.003782,
      "components": {
        "safety_gain": 8,
        "risk_severity": 1.2,
        "urgency_weight": 1.3,
        "cost": 3300
      }
    }
  ],
  "alternatives": {
    "SIGN_SPEED_LIMIT_600MM": [], "SIGN_SCHOOL_AHEAD_600MM": [], "SIGN_FUEL_PUMP_600MM": [], "SIGN_SIDE_ROAD_AHEAD_600MM": [], "SIGN_NO_PARKING_600MM": [], "SIGN_PEDESTRIAN_CROSSING_600MM": [], "MARK_LONGITUDINAL_REPAINT": [], "STUD_RETRO_BIDIR": [], "MARK_PEDESTRIAN_CROSSING": [], "POTHOLE_PATCH_20MM": [], "UNKNOWN": [], "SOLAR_BLINKER_REPAIR": [], "STREETLIGHT_LED_90W": [], "FMM_BRIDGE": [], "DELINEATOR_POLE": []
  },
  "bom_csv": "SKU,Description,Unit,Quantity,Unit Price,Total Price,Source\nSIGN_SPEED_LIMIT_600MM,Speed limit sign, 600mm, RA2,nos,1.0,3500.0,3500.0,CPWD Catalog\nSIGN_SCHOOL_AHEAD_600MM,School ahead sign, 600mm, RA2,nos,1.0,3200.0,3200.0,CPWD Catalog\nSIGN_FUEL_PUMP_600MM,Fuel pump informatory sign, 600mm, RA2,nos,1.0,3000.0,3000.0,CPWD Catalog\nSIGN_SIDE_ROAD_AHEAD_600MM,Side road ahead sign, 600mm, RA2,nos,1.0,3300.0,3300.0,CPWD Catalog\nSIGN_NO_PARKING_600MM,No Parking sign, 600mm, RA2,nos,1.0,3100.0,3100.0,CPWD Catalog\nSIGN_PEDESTRIAN_CROSSING_600MM,Pedestrian crossing sign, 600mm, RA2,nos,2.0,3300.0,6600.0,CPWD Catalog\nMARK_LONGITUDINAL_REPAINT,Repainting longitudinal markings, thermoplastic,m,203.5,25.0,5087.5,CPWD Catalog\nSTUD_RETRO_BIDIR,Retroreflective red-white bidirectional road stud,nos,20.0,120.0,2400.0,CPWD Catalog\nMARK_PEDESTRIAN_CROSSING,Pedestrian crossing thermoplastic marking,m2,12.0,500.0,6000.0,CPWD Catalog\nPOTHOLE_PATCH_20MM,Pothole patching 20mm depth (material only),m2,2.5,400.0,1000.0,CPWD Catalog\nSOLAR_BLINKER_REPAIR,Repair/replace solar blinker module (material only),nos,1.0,5000.0,5000.0,CPWD Catalog\nSTREETLIGHT_LED_90W,LED streetlight 90W (material only),nos,10.0,8000.0,80000.0,CPWD Catalog\nFMM_BRIDGE,FMM for minor bridge (retroreflective markers),nos,16.0,250.0,4000.0,CPWD Catalog\nDELINEATOR_POLE,Delineator/guide pole with RA2 sheeting,nos,20.0,300.0,6000.0,CPWD Catalog"
};

/* ------------------------------------------------------------------
   Panel component (simulated demo)
   - only displays results after user presses Run (hasRun flag)
   ------------------------------------------------------------------ */
export default function Panel({
  active,
  setActive,
  showToast,        // function passed from parent to show toasts (optional)
  estimateResult,
  setEstimateResult,
  curveResult,
  setCurveResult,
  ipsResult,
  setIpsResult,
  bomResult,
  setBomResult,
}) {
  const [pdfFile, setPdfFile] = useState(null);
  const [bomFile, setBomFile] = useState(null);
  const [ipsTop, setIpsTop] = useState(3);
  const [isProcessing, setIsProcessing] = useState(false);
  const [localEstimate, setLocalEstimate] = useState(null);
  const [hasRun, setHasRun] = useState(false); // <-- critical: false until user runs

  // small safe showToast fallback
  const toast = (msg, level = "info", ttl = 1200) => {
    if (typeof showToast === "function") return showToast(msg, level, ttl);
    // fallback console
    console[level === "error" ? "error" : "log"](`[toast:${level}] ${msg}`);
  };

  function simulateProcessing(fn, payload = null, delay = 800) {
    setIsProcessing(true);
    toast("Processing...", "info", 700);
    setTimeout(() => {
      try {
        fn && fn(payload);
      } finally {
        setIsProcessing(false);
        toast("Done (simulated)", "success", 1000);
      }
    }, delay);
  }

  function handleEstimatePdf(e) {
    e?.preventDefault?.();
    if (!pdfFile) return toast("Select a PDF first", "error");

    // choose which setters to call (parent-provided or local)
    const setter = typeof setEstimateResult === "function" ? setEstimateResult : setLocalEstimate;
    const bomSetter = typeof setBomResult === "function" ? setBomResult : (() => {});
    const curveSetter = typeof setCurveResult === "function" ? setCurveResult : (() => {});
    const ipsSetter = typeof setIpsResult === "function" ? setIpsResult : (() => {});

    simulateProcessing(() => {
      setter(SAMPLE_ESTIMATE);
      bomSetter(SAMPLE_ESTIMATE.bom ?? []);
      curveSetter(SAMPLE_ESTIMATE.curve_data ?? []);
      ipsSetter(SAMPLE_ESTIMATE.top_ips ?? SAMPLE_ESTIMATE.ips ?? []);
      setHasRun(true); // mark that user completed Run -> now show data
    }, SAMPLE_ESTIMATE, 900);
  }

  function handleBomCsv(e) {
    e?.preventDefault?.();
    if (!bomFile) return toast("Select CSV first", "error");
    const setter = typeof setBomResult === "function" ? setBomResult : (() => {});
    simulateProcessing(() => {
      setter(SAMPLE_ESTIMATE.bom);
      setHasRun(true);
    }, null, 700);
  }

  function handleBomRun(e) {
    e?.preventDefault?.();
    const setter = typeof setBomResult === "function" ? setBomResult : (() => {});
    simulateProcessing(() => {
      setter(SAMPLE_ESTIMATE.bom);
      setHasRun(true);
    }, null, 700);
  }

  // update ips only after a run occurred
  useEffect(() => {
    if (!hasRun) return;
    const all = SAMPLE_ESTIMATE.top_ips ?? SAMPLE_ESTIMATE.ips ?? [];
    const setter = typeof setIpsResult === "function" ? setIpsResult : (() => {});
    setter(all.slice(0, Math.max(1, ipsTop)));
  }, [ipsTop, setIpsResult, hasRun]);

  // data source helper: prefer parent state (if provided) else local state
  function source() {
    if (hasRun) {
      return estimateResult ?? localEstimate ?? SAMPLE_ESTIMATE;
    }
    return null; // BEFORE RUN: return null so UI shows "no results yet"
  }

  function getInterventions() {
    const src = source();
    return Array.isArray(src?.items) ? src.items : [];
  }

  function getBomRows() {
    if (Array.isArray(bomResult) && bomResult.length) return bomResult;
    const src = source();
    return Array.isArray(src?.bom) ? src.bom : [];
  }

  function getCurvePoints() {
    const src = source();
    const arr = Array.isArray(curveResult) && curveResult.length ? curveResult : (Array.isArray(src?.curve_data) ? src.curve_data : []);
    return Array.isArray(arr) ? arr.map(p => ({ cost: Number(p.cost ?? 0), safety: Number(p.safety_gain ?? p.safety ?? 0), name: p.id ?? p.name ?? "", roi: Number(p.roi ?? 0) })) : [];
  }

  function getIpsArray() {
    if (!hasRun) return [];
    if (Array.isArray(ipsResult) && ipsResult.length) return ipsResult;
    const src = source();
    return Array.isArray(src?.top_ips) ? src.top_ips : (SAMPLE_ESTIMATE.top_ips ?? []);
  }

  function getSummary() {
    const src = source();
    return src?.summary ?? null;
  }

  function downloadBomCsv() {
    const csvString = SAMPLE_ESTIMATE.bom_csv ?? "";
    if (!csvString) return toast("No CSV available", "error");
    const blob = new Blob([csvString], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "bom_from_server.csv";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    toast("CSV download started", "info");
  }

  // ------ render helpers (will show only after hasRun) ------
  function renderEstimateResults() {
    if (!hasRun) return <div className="muted small">No estimate results yet. Upload a PDF and press Run.</div>;
    const interventions = getInterventions();
    const summary = getSummary() ?? SAMPLE_ESTIMATE.summary;

    if (!interventions || interventions.length === 0) {
      return <div className="muted small">No estimate items found in the extract.</div>;
    }

    const totalFromItems = interventions.reduce((acc, it) => acc + (Number(it.total_price ?? it.total ?? 0) || 0), 0);
    const grandTotal = Number(summary?.material_total_cost ?? totalFromItems ?? 0);

    return (
      <div className="results-card">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
          <h3>Extracted interventions (simulated)</h3>
          <div className="muted small">Mapped: {summary?.mapped_items ?? interventions.length} • Unknown: {summary?.unknown_items ?? 0}</div>
        </div>

        <div className="results-table-wrap">
          <table className="results-table">
            <thead>
              <tr>
                <th>#</th>
                <th>SKU / Description</th>
                <th>IRC clause</th>
                <th>Units</th>
                <th>Unit price</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {interventions.map((it, idx) => {
                const name = it.description ?? it.label ?? `Item ${idx + 1}`;
                const clause = it.clause ?? "-";
                const units = it.quantity ?? it.total_quantity ?? it.units ?? "";
                const unitPrice = it.unit_price ?? it.unit_cost ?? "";
                const amount = it.total_price ?? (units && unitPrice ? Number(units) * Number(unitPrice) : 0);
                const sku = it.sku ?? it.item ?? "";
                return (
                  <tr key={idx}>
                    <td>{idx + 1}</td>
                    <td style={{ minWidth: 260 }}>
                      <div style={{ fontWeight: 700 }}>{sku}</div>
                      <div className="muted small">{name}</div>
                    </td>
                    <td><a href={it.clause_url ?? "#"} target="_blank" rel="noreferrer" className="muted small">{clause}</a></td>
                    <td>{units}</td>
                    <td>{unitPrice}</td>
                    <td>{amount}</td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={5} style={{ textAlign: "right", fontWeight: 700 }}>Total</td>
                <td style={{ fontWeight: 800 }}>{grandTotal}</td>
              </tr>
            </tfoot>
          </table>
        </div>

        <div style={{ marginTop: 12 }} className="muted small">
          <div>Total interventions: {summary.total_interventions}</div>
          <div>Material total cost: ₹ {Number(summary.material_total_cost).toLocaleString()}</div>
        </div>

        <div style={{ marginTop: 12 }}>
          <button className="btn primary" onClick={downloadBomCsv}>Download BOM CSV (simulated)</button>
        </div>
      </div>
    );
  }

  function renderCurveResults() {
    if (!hasRun) return <div className="muted small">Curve plot is generated from the extracted PDF data (no manual input). Run Estimate first if empty.</div>;
    const points = getCurvePoints();
    if (!points || points.length === 0) return <div className="muted small">No curve data yet — run Estimate first.</div>;

    return (
      <div className="results-card">
        <h3>Curve: Safety vs Cost (simulated)</h3>
        <div style={{ width: "100%", height: 360 }}>
          <Plot points={points} />
        </div>
        <pre className="muted small" style={{ marginTop: 10 }}>{JSON.stringify(points, null, 2)}</pre>
      </div>
    );
  }

  function renderIpsResults() {
    if (!hasRun) return <div className="muted small">No IPS ranking yet. Run Estimate first to calculate IPS.</div>;
    const ipsArr = getIpsArray();
    if (!Array.isArray(ipsArr) || ipsArr.length === 0) return <div className="muted small">No IPS ranking available.</div>;

    return (
      <div className="results-card">
        <h3>Top IPS Recommendations (simulated)</h3>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
          <div className="muted small">Showing top {ipsArr.length}</div>
        </div>

        <table className="results-table">
          <thead><tr><th>#</th><th>Intervention ID</th><th>IPS</th><th>Safety gain</th><th>Cost</th></tr></thead>
          <tbody>
            {ipsArr.map((r, i) => (
              <tr key={i}>
                <td>{i + 1}</td>
                <td>{r.intervention_id}</td>
                <td>{Number(r.ips).toFixed(6)}</td>
                <td>{r.components?.safety_gain ?? "-"}</td>
                <td>{r.components?.cost ?? "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <pre className="muted small" style={{ marginTop: 10 }}>{JSON.stringify(ipsArr, null, 2)}</pre>
      </div>
    );
  }

  function renderBomResults() {
    if (!hasRun) return <div className="muted small">No BOM yet. Run Estimate to generate a BOM.</div>;
    const rows = getBomRows();
    if (!rows || rows.length === 0) return <div className="muted small">No BOM rows available.</div>;
    const total = rows.reduce((s, r) => s + (Number(r.total_price ?? r.total ?? 0) || 0), 0);

    return (
      <div className="results-card">
        <h3>Bill of Materials (simulated)</h3>
        <div className="results-table-wrap">
          <table className="results-table">
            <thead><tr><th>#</th><th>SKU</th><th>Description</th><th>Qty</th><th>Unit</th><th>Unit price</th><th>Amount</th></tr></thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={i}>
                  <td>{i + 1}</td>
                  <td>{r.sku ?? "-"}</td>
                  <td>{r.description ?? "-"}</td>
                  <td>{r.total_quantity ?? r.quantity ?? "-"}</td>
                  <td>{r.unit ?? "-"}</td>
                  <td>{r.unit_price ?? "-"}</td>
                  <td>{r.total_price ?? r.total ?? "-"}</td>
                </tr>
              ))}
            </tbody>
            <tfoot><tr><td colSpan={6} style={{ textAlign: "right", fontWeight: 700 }}>Total</td><td style={{ fontWeight: 800 }}>{total}</td></tr></tfoot>
          </table>
        </div>

        <div style={{ marginTop: 12 }}>
          <button className="btn primary" onClick={downloadBomCsv}>Download CSV (simulated)</button>
        </div>
        <pre className="muted small" style={{ marginTop: 10 }}>{JSON.stringify(rows, null, 2)}</pre>
      </div>
    );
  }

  // ----------------- main render -----------------
  function renderContent() {
    switch (active) {
      case "estimate_pdf":
        return (
          <>
            <form onSubmit={handleEstimatePdf} className="panel-form">
              <div className="grid-3">
                <div className="col-2">
                  <label className="label">Upload PDF</label>
                  <div className="row">
                    <input type="file" accept="application/pdf" onChange={(e) => setPdfFile(e.target.files?.[0] ?? null)} className="file-input" />
                    <button className="btn primary" type="submit" disabled={isProcessing}>{isProcessing ? "Processing..." : "Run"}</button>
                  </div>
                </div>

                <div className="col-1">
                  <div className="card small">
                    <div className="muted">Quick actions</div>
                    <button className="btn" type="button" onClick={() => { setPdfFile(null); toast("Cleared PDF", "info"); }}>Clear</button>
                  </div>
                </div>
              </div>
            </form>

            <div style={{ marginTop: 18 }}>{renderEstimateResults()}</div>
          </>
        );

      case "curve_data":
        return (
          <>
            <div className="panel-form" style={{ marginBottom: 12 }}>
              <div className="muted small">Curve plot is generated from the extracted PDF data (no manual input). Run Estimate first if empty.</div>
            </div>

            <div style={{ marginTop: 18 }}>{renderCurveResults()}</div>
          </>
        );

      case "ips_ranking":
        return (
          <>
            <div className="panel-form">
              <label className="label">Top N recommendations</label>
              <div className="row" style={{ alignItems: "center" }}>
                <input type="number" min={1} value={ipsTop} onChange={(e) => setIpsTop(Number(e.target.value) || 1)} className="input" style={{ width: 120 }} />
                <div className="muted small" style={{ marginLeft: 12 }}>Results update automatically after Run</div>
              </div>
            </div>

            <div style={{ marginTop: 18 }}>{renderIpsResults()}</div>
          </>
        );

      case "bom":
        return (
          <>
            <div className="panel-form">
              <div className="grid-3">
                <div className="col-2">
                  <label className="label">Generate BOM (simulated)</label>
                  <p className="muted small">This will use simulated BOM derived from the sample extract.</p>
                  <div className="row gap">
                    <button className="btn primary" onClick={handleBomRun} disabled={isProcessing}>{isProcessing ? "Processing..." : "Run BOM"}</button>
                    <button className="btn" onClick={() => toast("BOM queued (simulated)", "info")}>Queue</button>
                  </div>
                </div>

                <div className="col-1">
                  <div className="card small">
                    <div className="muted">Tip</div>
                    <div className="muted small">Use BOM CSV tab to upload an external CSV (simulated)</div>
                  </div>
                </div>
              </div>
            </div>

            <div style={{ marginTop: 18 }}>{renderBomResults()}</div>
          </>
        );

      case "bom_csv":
        return (
          <>
            <form onSubmit={handleBomCsv} className="panel-form">
              <label className="label">Upload BOM CSV</label>
              <input type="file" accept=".csv" onChange={(e) => setBomFile(e.target.files?.[0] ?? null)} className="file-input" />
              <div className="row gap">
                <button className="btn primary" disabled={isProcessing}>{isProcessing ? "Processing..." : "Upload"}</button>
                <button type="button" className="btn" onClick={() => setBomFile(null)}>Clear</button>
              </div>
            </form>

            <div style={{ marginTop: 18 }}>
              <div className="muted small">If a BOM has been generated, you can also download it from the BOM page or use the server CSV (Estimate → Download BOM CSV).</div>
            </div>
          </>
        );

      default:
        return null;
    }
  }

  return (
    <div className="panel-card" style={{ paddingBottom: 20 }}>
      <div className="panel-header">
        <div>
          <h1 className="panel-title">{active.replace(/_/g, " ").toUpperCase()}</h1>
          <div className="muted small">Use these controls to demo the flow locally (simulated results).</div>
        </div>

        <div className="host-badge">
          <div className="host-small">Mode</div>
          <div className="host-url">{hasRun ? "http://127.0.0.1:8000" : "http://127.0.0.1:8000"}</div>
        </div>
      </div>

      <div className="panel-body">{renderContent()}</div>

      <div className="footer muted small">© 2025 RoadIntel — Demo mode</div>
    </div>
  );
}
