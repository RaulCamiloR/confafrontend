
import { NextResponse } from "next/server";
import axios from "axios";

export async function POST(request: Request) {

    try {

        const { name, type, templateName, segmentName } = await request.json();

        const response = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/campaign/create-campaign`, {
            name,
            type,
            templateName,
            segmentName
        }, { withCredentials: true })

        return NextResponse.json(response.data, { status: 200 });
        
    } catch (error: any) {

        return NextResponse.json({ error: 'Error de conexión al crear campaña' }, { status: 500 });
    }

}
