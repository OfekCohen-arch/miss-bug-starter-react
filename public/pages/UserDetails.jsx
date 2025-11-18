const { useState, useEffect } = React
const { useParams, useNavigate } = ReactRouterDOM

import { BugList } from "../cmps/BugList.jsx"
import { bugService } from "../services/bug.service.remote.js"
import { userService } from "../services/user.service.js"

export function UserDetails(){
    const [user, setUser] = useState(null)
    const [bugs, setBugs] = useState(null)
    const params = useParams()
    const navigate = useNavigate()

    useEffect(() => {
        loadUser()
        loadBugs()
    }, [params.userId])
    function loadBugs(){
     bugService.query({userId:params.userId})
     .then(setBugs)
    }
    function loadUser() {
        userService.getById(params.userId)
            .then(setUser)
            .catch(err => {
                console.log('err:', err)
                navigate('/')
            })
    }

    function onBack() {
        navigate('/')
    }

    if (!user || !bugs) return <div>Loading...</div>
    
    return(
        <div className="user-details">
        <section className="user-details">
            <h1>User {user.fullname}</h1>
            <pre>
                {JSON.stringify(user, null, 2)}
            </pre>
           <BugList bugs={bugs}/>
            <button onClick={onBack} >Back</button>
        </section>
        </div>
    )
}