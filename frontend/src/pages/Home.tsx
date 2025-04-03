import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";

function Home() {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate("/about");
    };

    return (
        <div className="p-4 text-foreground min-h-screen flex flex-col items-center justify-center">
            <Button
                onClick={handleClick}
                className="px-4 py-2  text-primary-foreground rounded-md hover:bg-primary/80 transition bg-blue-500 dark:bg-primary"
            >
                Click me to go to About
            </Button>
            <h1 className="text-2xl font-bold mt-4">Home Page</h1>
        </div>
    );
}

export default Home;
