import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const logs = await prisma.auditLog.findMany({
      orderBy: { createdAt: 'desc' }
    });

    // Create CSV header
    let csv = 'ID,Phase,AI_Prediction_Label,AI_Probability,XAI_Modality,Created_At\n';

    // Add rows
    logs.forEach(log => {
      const escapedLabel = `"${log.aiPredictionLabel.replace(/"/g, '""')}"`;
      csv += `${log.id},${log.phase},${escapedLabel},${log.aiProbability},${log.xaiModality},${log.createdAt.toISOString()}\n`;
    });

    return new NextResponse(csv, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': 'attachment; filename="xai_audit_compliance_report.csv"'
      }
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to generate CSV" }, { status: 500 });
  }
}
