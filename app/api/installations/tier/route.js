import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request) {
  try {
    const { installation_id, new_tier } = await request.json();

    // Validate input
    if (!installation_id || !new_tier) {
      return NextResponse.json(
        { error: 'Missing installation_id or new_tier' },
        { status: 400 }
      );
    }

    if (!['basic', 'enterprise'].includes(new_tier)) {
      return NextResponse.json(
        { error: 'Invalid tier. Must be "basic" or "enterprise"' },
        { status: 400 }
      );
    }

    // Update the installation's subscription tier
    const installation = await prisma.saas_installations.update({
      where: { id: installation_id },
      data: {
        subscription_tier: new_tier,
        updated_at: new Date()
      },
      select: {
        id: true,
        company_name: true,
        domain: true,
        subscription_tier: true
      }
    });

    // TODO: Send webhook to installation to notify of tier change
    // This will be implemented in the next step
    const webhookSuccess = await sendTierUpdateWebhook(installation, new_tier);

    return NextResponse.json({
      success: true,
      installation: installation,
      webhook_sent: webhookSuccess
    });

  } catch (error) {
    console.error('Error updating subscription tier:', error);

    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Installation not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to update subscription tier' },
      { status: 500 }
    );
  }
}

// Webhook function to notify installation of tier change
async function sendTierUpdateWebhook(installation, newTier) {
  try {
    // Skip webhook if no domain configured
    if (!installation.domain) {
      console.log(`No domain configured for installation ${installation.id}, skipping webhook`);
      return false;
    }

    // Use http for localhost, https for everything else
    const protocol = installation.domain.includes('localhost') ? 'http' : 'https';
    const webhookUrl = `${protocol}://${installation.domain}/api/webhook/tier-update`;

    // TODO: Add proper webhook authentication
    // For now, we'll send without auth but this should be secured
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // TODO: Add webhook secret authentication
        // 'Authorization': `Bearer ${installation.webhook_secret}`
      },
      body: JSON.stringify({
        tier: newTier,
        updated_by: 'saas_management',
        updated_at: new Date().toISOString()
      }),
      // Timeout after 5 seconds
      signal: AbortSignal.timeout(5000)
    });

    if (response.ok) {
      console.log(`Successfully sent tier update webhook to ${installation.domain}`);
      return true;
    } else {
      console.log(`Webhook failed for ${installation.domain}: ${response.status} ${response.statusText}`);
      return false;
    }

  } catch (error) {
    console.error(`Webhook error for installation ${installation.id}:`, error.message);
    return false;
  }
}