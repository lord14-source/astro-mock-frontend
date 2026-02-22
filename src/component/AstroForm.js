import { useState } from "react";

function AstroForm() {

  const [form, setForm] = useState({
    name: "",
    dob: "",
    tob: "",
    location: ""
  });

  const [result, setResult] = useState("");

  const handleChange = e => {
    setForm({...form, [e.target.name]: e.target.value});
  };

  const submit = async e => {
    e.preventDefault();

    const res = await fetch("http://localhost:8080/astro/generate", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(form)
    });

    const data = await res.json();
    setResult(data.prediction);
  };

  return (
    <div className="form-box">

      <form onSubmit={submit}>

        <input name="name" placeholder="Name"
          onChange={handleChange} required />

        <input type="date" name="dob"
          onChange={handleChange} required />

        <input name="tob" placeholder="Time of birth"
          onChange={handleChange} required />

        <input name="location" placeholder="Location"
          onChange={handleChange} required />

        <button>Generate Horoscope</button>

      </form>

      {result && (
        <div className="result">
          🔮 {result}
        </div>
      )}

    </div>
  );
}

export default AstroForm;
