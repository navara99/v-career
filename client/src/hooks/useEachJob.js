import { useEffect, useState } from "react";
import axios from "axios";

const useEachJob = (id) => {
  const [job, setJob] = useState([]);

  useEffect(() => {
    axios.get(`/api/jobs/${id}`).then(({ data }) => {

      setJobs(data);
    });
  }, []);

  return [job, setJob];
};

export default useEachJob;