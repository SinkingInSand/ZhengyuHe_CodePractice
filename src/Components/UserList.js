import React, { useState, useEffect } from "react";

//There are total 2 pages in the data source
const API_URL = "https://reqres.in/api/users";
const Default_Delay = 3;

const UserList = () => {
    const [page, setPage] = useState(1);
    const [userInfo, setUserInfo] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [filter, setFilter] = useState("");
    const [lastLoadTime, setLastLoadTime] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const fetchData = async(delay = Default_Delay) => {
        setIsLoading(true);
        const url = `${API_URL}?delay=${delay}`;
        const userList = await fetch(url)
        .then(response => {
            if (response.status < 200 || response.status >= 300) {
                setErrorMessage("Time out of 3 seconds.")
              }
              return response.json();
        })
        .then((data) => {
            setUserInfo(data.data);
            setIsLoading(false);
            setLastLoadTime(new Date().toLocaleTimeString());
        });
    }
    
    useEffect(() => {
        fetchData();
    },[]);
    
    const handlePageChange = () => {
        setPage(page == 1 ? 2 : 1);
    }
    const handleDelayChange = () => {
        fetchData(5);
    };
 
    const handleFilterChange = (event) => {
        setFilter(event.target.value);
    };

    const filteredUsers = userInfo.filter(
        (user) =>
          user.first_name.toLowerCase().includes(filter.toLowerCase()) ||
          user.last_name.toLowerCase().includes(filter.toLowerCase()) ||
          user.email.toLowerCase().includes(filter.toLowerCase())
    );
    
    return (
        <div className="userlist">
            <div>
                <h1>User List</h1>
                <button onClick={handlePageChange}>{page == 1 ? "switch to page 2" : "switch to page 1"}</button>
                <br></br>
                <button onClick={handleDelayChange}>Simulate Delay of 5 Seconds</button>
            </div>
            <div>
                {isLoading ? 
                <p> Loading... </p> : (errorMessage ? <p> {errorMessage} </p> :
                <div>
                     <p>Last Load Time: {lastLoadTime}</p>
                     <input type="text" placeholder="Filter by Name or Email" value={filter} onChange={handleFilterChange} />
                     <div>
                        {filteredUsers.map((user) => (
                            <div key={user.id}>
                                <img src={user.avatar} alt={user.first_name} />
                                <p>Name: {user.first_name} {user.last_name}</p>
                                <p>Email: {user.email}</p>
                            </div>
                        ))}
                    </div>
                </div>
                )}
            </div>
        </div>
    );

}

export default UserList;