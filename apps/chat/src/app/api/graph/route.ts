import { NextRequest, NextResponse } from 'next/server';
import { generateGraphImageData } from '@greenCheck/greencheck-module';

export async function GET(request: NextRequest) {
  try {
    // Call the generateGraphImageData function from the greencheck-module
    const graphResult = await generateGraphImageData();
    
    // Return the image data as a base64 string for easy transmission
    const base64Image = Buffer.from(graphResult.imageData).toString('base64');
    
    return NextResponse.json({ 
      success: true, 
      message: 'Graph generated successfully',
      data: {
        image: base64Image,
        mimeType: graphResult.mimeType,
        size: graphResult.size
      }
    });
  } catch (error) {
    console.error('Error generating graph:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to generate graph',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const { graphId } = await request.json();
  if (!graphId) {
    return NextResponse.json({
      success: false,
      error: 'Graph ID is required'
    }, { status: 400 });
  }
  
  try {
    // Call the generateGraphImageData function from the greencheck-module
    const graphResult = await generateGraphImageData(graphId);
    
    // Return the image data as a base64 string for easy transmission
    const base64Image = Buffer.from(graphResult.imageData).toString('base64');
    
    return NextResponse.json({ 
      success: true, 
      message: 'Graph generated successfully',
      data: {
        image: base64Image,
        mimeType: graphResult.mimeType,
        size: graphResult.size
      }
    });
  } catch (error) {
    console.error('Error generating graph:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to generate graph',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
