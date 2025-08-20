import { NextResponse } from "next/server";
import { managementPrisma } from "../../../../lib/prisma";
import { generateSetupToken } from "../../../../lib/deployment-automation";

export async function POST(request, { params }) {
  try {
    const installationId = params.id;
    const { action } = await request.json();

    if (!["generate", "regenerate"].includes(action)) {
      return NextResponse.json(
        { error: "Invalid action. Use 'generate' or 'regenerate'" },
        { status: 400 }
      );
    }

    // Check if installation exists
    const installation = await managementPrisma.saas_installations.findUnique({
      where: { id: installationId },
      select: { 
        id: true,
        company_name: true,
        setup_completed: true,
        deployment_status: true,
        setup_token: true,
        deployment_url: true
      }
    });

    if (!installation) {
      return NextResponse.json(
        { error: "Installation not found" },
        { status: 404 }
      );
    }

    // Don't allow token operations if setup is already completed
    if (installation.setup_completed) {
      return NextResponse.json(
        { error: "Cannot generate token - setup has already been completed" },
        { status: 400 }
      );
    }

    // For regenerate action, ensure token already exists
    if (action === "regenerate" && !installation.setup_token) {
      return NextResponse.json(
        { error: "Cannot regenerate token - no existing token found. Use 'generate' action instead." },
        { status: 400 }
      );
    }

    // For generate action, ensure token doesn't already exist
    if (action === "generate" && installation.setup_token) {
      return NextResponse.json(
        { error: "Token already exists. Use 'regenerate' action to create a new one." },
        { status: 400 }
      );
    }

    // Ensure deployment URL is set (recommended but not required)
    if (!installation.deployment_url) {
      return NextResponse.json(
        { error: "Deployment URL is required before generating a setup token. Please set it in the installation settings." },
        { status: 400 }
      );
    }

    // Generate new setup token
    const result = await generateSetupToken(installationId, installation.company_name);
    
    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Setup token ${action}d successfully`,
      setupToken: result.setupToken,
      expiresAt: result.expiresAt
    });

  } catch (error) {
    console.error("Error with setup token operation:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}