export class BukAPI {
    static async getUser(doc){
        try {
            const req = await fetch(`${process.env.BUK_API}/employees?status=activo&document_number=${doc}`,{
                    method: 'GET', 
                    headers : { 
                        'Content-Type': 'application/json',
                        'auth_token' : `${process.env.BUK_AUTH_TOKEN}` 
                    }
                }       
            );

            const { data } = await req.json();

            if(!req.ok) throw new Error('Error al buscar usuario en buk');

            return { success: true, data }

        } catch (err) {
            return { success: false, message: err.message || 'Internal Server Error' }
        }
    }
    
    static async getRoles(){
        try {
            const req = await fetch(`${process.env.BUK_API}/role_families`,{
                    method: 'GET', 
                    headers : { 
                        'Content-Type': 'application/json',
                        'auth_token' : `${process.env.BUK_AUTH_TOKEN}` 
                    }
                }
            );

            const { data } = await req.json();

            if(!req.ok) throw new Error('Error al traer los roles de buk');

            return { success: true, data }
        } catch (err) {
            return { success: false, message: err.message || 'Internal Server Error' }
        }
    }
}