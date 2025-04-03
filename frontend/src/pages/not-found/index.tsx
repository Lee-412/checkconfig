import { Link } from "react-router-dom";
import "./NotFound.css";
import { Button } from "../../components/ui/button";

function NotFound() {
  return (
    <section className="page_404">
      <div className="container ">
        <div className="row">
          <div className="col-sm-12 text-center">
            <div className="four_zero_four_bg">
              <h1 className="text-6xl font-bold text-gray-800">404</h1>
            </div>
            <Button
              className="bg-blue-500 text-white hover:bg-blue-600 px-4 py-2 rounded-md"
              asChild
            >
              <Link to="/home">Go to Home</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default NotFound;
