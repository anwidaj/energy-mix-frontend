import Head from 'next/head';

export default function Home() {
  return (
    <>
      <Head>
        <title>Energy Mix Dashboard</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      {/* Background */}
      <main className="bg-light min-vh-100 py-5">

        {/* Container */}
        <div className="container">

          <div className="row mb-4">
            <div className="col-12 text-center">
              <h1 className="fw-bold text-success">Energy Mix Dashboard</h1>
              <p className="text-muted"></p>
            </div>
          </div>

          <div className="row">
            {/* Pie chart */}
            <div className="col-lg-8 mb-4">
              <div className="card shadow-sm h-100">
                <div className="card-body">
                  <h5 className="card-title">Actual energy mix</h5>
                  <p className="card-text text-muted"></p>
                </div>
              </div>
            </div>

            {/* Charging window */}
            <div className="col-lg-4 mb-4">
              <div className="card shadow-sm h-100 border-success">
                <div className="card-body">
                  <h5 className="card-title text-success">Best time to charge</h5>
                  <p className="card-text text-muted"></p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </main>
    </>
  );
}
