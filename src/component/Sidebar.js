function Sidebar({ logout }) {

  return (

    <div className="sidebar">

      <h2>Astro</h2>

      <button>Dashboard</button>
      <button>History</button>

      <button onClick={logout}>
        Logout
      </button>

    </div>
  );
}

export default Sidebar;
