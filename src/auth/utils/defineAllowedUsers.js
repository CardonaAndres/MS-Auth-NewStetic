export class AllowedUsers {
    static defineAllowedUsers(appName) {
        const allowedUsers = [
            'ptic',
            'ptic2',
            'stapias',
            'amjimenez'
        ];

        switch (appName) {
            case 'SST':
                allowedUsers.push(
                    'lvargas',
                    'crestrepo'
                );
            break;

            case 'BUYORDER':
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