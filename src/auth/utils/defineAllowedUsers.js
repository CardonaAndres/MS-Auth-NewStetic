export class AllowedUsers {
    static defineAllowedUsers(appName) {
        //Usuarios generales (TIC) que pueden acceder a todos los aplicativos
        const allowedUsers = [
            'ptic',
            'ptic2',
            'stapias',
            'amjimenez'
        ];

        switch (appName) {
            case 'SST':
                // Usuarios unicos para el aplicativo de SST
                allowedUsers.push(

                );
            break;

            case 'BUYORDER':
                // Usuarios unicos para el aplicativo de BuyOrder
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