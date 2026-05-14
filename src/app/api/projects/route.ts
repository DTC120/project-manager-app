import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Project from '@/models/Project';

export async function GET() {
  try {
    await dbConnect();
    const projects = await Project.find({});
    return NextResponse.json(projects);
  } catch (error) {
    console.error('GET /api/projects error:', error);
    const message = error instanceof Error ? error.message : 'Fallo al cargar los proyectos';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const body = await request.json();
    const project = new Project(body);
    await project.save();
    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    console.error('POST /api/projects error:', error);
    const message = error instanceof Error ? error.message : 'Fallo al crear el proyecto';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
