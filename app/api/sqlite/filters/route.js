import { NextResponse } from "next/server";
import { getTenantDb } from "@/db/tenantManager";
import { saveMenuFilters } from "@/db/procedures/saveMenuFilters";
import { getMenuFilters } from "@/db/procedures/getMenuFilters";
import { deleteMenuFilters } from "@/db/procedures/deleteMenuFilters";
import { getDomainInfo } from "@/app/(core)/utils/getDomainInfo";
import { extractDomain } from "../commonController";

export async function POST(req) {
  try {
    const body = await req.json();
    const { menuIdentifier, filters, domain: requestDomain } = body;

    if (!menuIdentifier || !Array.isArray(filters)) {
      return NextResponse.json(
        { error: "Missing required fields: menuIdentifier and filters array" },
        { status: 400 }
      );
    }

    let targetDomain = requestDomain;
    if (!targetDomain) {
      const domainInfo = await getDomainInfo().catch(() => ({}));
      targetDomain = domainInfo?.hostname || "default";
    }

    const db = getTenantDb(targetDomain);
    const result = saveMenuFilters(db, filters, menuIdentifier);

    return NextResponse.json({
      success: true,
      domain: targetDomain,
      menuIdentifier,
      ...result,
    });
  } catch (error) {
    console.error("❌ SQLite Filters POST error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const menuIdentifier = searchParams.get("menu") || searchParams.get("menuIdentifier");

    if (!menuIdentifier) {
      return NextResponse.json(
        { error: "Missing required query parameter: menu" },
        { status: 400 }
      );
    }

    let targetDomain = searchParams.get("domain");
    if (!targetDomain) {
      const domainInfo = await getDomainInfo().catch(() => ({}));
      targetDomain = domainInfo?.hostname || "default";
    }

    const db = getTenantDb(targetDomain);
    const filters = getMenuFilters(db, menuIdentifier);

    // Format options back to parsed objects if needed, matching GETFILTERLIST rd format
    const formatted = filters.map((f) => {
      let parsedOptions = [];
      try {
        parsedOptions = typeof f.options === "string" ? JSON.parse(f.options) : f.options;
      } catch (_) {
        parsedOptions = f.options;
      }
      return {
        id: f.id,
        Name: f.Name,
        Fil_DisName: f.Fil_DisName,
        Fil_No: f.Fil_No,
        options: typeof f.options === "string" ? f.options : JSON.stringify(f.options || []),
        parsedOptions,
      };
    });

    return NextResponse.json({
      success: true,
      domain: targetDomain,
      menuIdentifier,
      data: formatted,
    });
  } catch (error) {
    console.error("❌ SQLite Filters GET error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

/*
export async function DELETE(req) {
  try {
    let body = {};
    try {
      body = await req.json();
    } catch (_) {}

    let targetDomain = extractDomain(req, body);
    if (!targetDomain) {
      const domainInfo = await getDomainInfo().catch(() => ({}));
      targetDomain = domainInfo?.hostname || "default";
    }

    const { searchParams } = new URL(req.url);
    const options = {
      menuIdentifier: searchParams.get("menu") || searchParams.get("menuIdentifier") || body.menuIdentifier || body.menu,
    };

    const db = getTenantDb(targetDomain);
    const result = deleteMenuFilters(db, options);

    return NextResponse.json({
      success: true,
      domain: targetDomain,
      ...result,
    });
  } catch (error) {
    console.error("❌ SQLite Filters DELETE error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
*/
