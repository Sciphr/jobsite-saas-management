import { getInstallations, createInstallation } from '../../lib/saas-recovery';

export async function GET(request) {
  try {
    const result = await getInstallations();
    
    if (!result.success) {
      return Response.json({ error: result.error }, { status: 500 });
    }

    return Response.json(result);

  } catch (error) {
    console.error('Error fetching installations:', error);
    return Response.json({ error: 'Failed to fetch installations' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { domain, companyName, adminEmail, databaseUrl, billingEmail, billingPlan, notes } = body;

    if (!domain || !companyName || !adminEmail) {
      return Response.json({ 
        error: 'Domain, company name, and admin email are required' 
      }, { status: 400 });
    }

    const result = await createInstallation({
      domain,
      companyName,
      adminEmail,
      databaseUrl,
      billingEmail,
      billingPlan,
      notes
    });

    if (!result.success) {
      return Response.json({ error: result.error }, { status: 500 });
    }

    return Response.json(result);

  } catch (error) {
    console.error('Error creating installation:', error);
    return Response.json({ error: 'Failed to create installation' }, { status: 500 });
  }
}