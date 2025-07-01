export class AllowedUsers {
    static defineAllowedUsers(appName) {
        //Usuarios generales
        const allowedUsers = [
            'ptic',
            'ptic2',
            'stapias'
        ];

        switch (appName) {
            case 'SST':
                // Usuarios unicos para el aplicativo de SST
                allowedUsers.push(

                );
                break;
            default:
                const err = new Error('App desconocida');
                err.status = 404;
                throw err; 
        }

        return allowedUsers

    }
}