import { NextResponse } from "next/server";
import { getInstallationById } from "../../../lib/saas-recovery";

/**
 * Get installation details by ID
 */
export async function GET(request, { params }) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: "Installation ID is required" },
        { status: 400 }
      );
    }

    const result = await getInstallationById(id);

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      installation: result.installation,
    });
  } catch (error) {
    console.error("Error fetching installation:", error);
    return NextResponse.json(
      { error: "Failed to fetch installation" },
      { status: 500 }
    );
  }
}
