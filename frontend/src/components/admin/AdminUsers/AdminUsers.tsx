import './AdminUsers.css'

export default function AdminUsers() {

    return (
        <div className='admin-users'>
            <table>
                <tbody>
                    <tr>
                        <th>Username</th>
                        <th>Email</th>
                        <th>Registered At</th>
                        <th>User Type</th>
                    </tr>
                    
                </tbody>
            </table>
        </div>
    )
}