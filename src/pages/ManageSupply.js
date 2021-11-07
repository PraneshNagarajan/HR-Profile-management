import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useHistory, useLocation, useParams } from "react-router-dom";
import { firestore } from "../firebase";
import { PaginationActions } from "../Redux/PaginationSlice";
import { useMediaQuery } from "react-responsive";

const ManageSupply = () => {
    const params = useParams()
    const [demandData, setDemandData] = useState([])
    const dispatch = useDispatch()
    const sm = useMediaQuery({ maxWidth: 768 });

    useEffect(() => {
        firestore.collection("Demands").doc(params.demandId).get().then((data) => {
            setDemandData(data)
            dispatch(PaginationActions.initial({
                size: data.profiles.length,
                count: sm ? 10 : 20,
                current: 1,
              }))
        }).catch((err) => console.log(String(err)))
    },[params.demandId])

    return(<></>)
}

export default ManageSupply