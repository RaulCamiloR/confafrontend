import { NextResponse } from "next/server";
import axios from "axios";
export async function POST(request: Request) {

    try {

        const { templateName, content, channel } = await request.json();
        
        const htmlBase64 = Buffer.from(content).toString('base64');
        
        const params = {
            templateName,
            content: htmlBase64,
            channel
        }

        // hi

        console.log({params})

        const response = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/email/templates`, params, { withCredentials: true })

        console.log({response})

        return NextResponse.json(response.data, { status: 200 });
        
    } catch (error: any) {
        console.error('Error al crear plantilla:', error);
        
        // Si es un error de respuesta del backend (tiene propiedad response)
        if (error.response) {
            const statusCode = error.response.status || 500;
            const errorMessage = error.response.data?.message || 'Error al crear plantilla';
            
            // Intenta extraer el nombre del template para el mensaje de error
            // Obtiene el templateName de la petición original si es posible
            let templateNameValue = '';
            try {
                const requestData = await request.clone().json();
                templateNameValue = requestData.templateName || '';
            } catch (e) {
                // Si no podemos acceder a los datos originales, continuamos sin el nombre
            }
            
            // Si el error es específicamente sobre un template duplicado (ajusta según la respuesta real del backend)
            if (statusCode === 409 || errorMessage.includes('duplicate') || errorMessage.includes('existe')) {
                return NextResponse.json({ 
                    error: `Ya existe un template con el nombre "${templateNameValue}". Por favor, utiliza otro nombre.` 
                }, { status: 409 });
            }
            
            // Devuelve el mensaje de error y el código de estado exactos del backend
            return NextResponse.json({ error: errorMessage }, { status: statusCode });
        }
        
        // Para otros tipos de errores (red, timeout, etc.)
        return NextResponse.json({ error: 'Error de conexión al crear plantilla' }, { status: 500 });
    }

}
