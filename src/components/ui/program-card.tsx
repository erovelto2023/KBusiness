
import { Card, CardContent, CardFooter } from "./card";
import { Button } from "./button";
import { ExternalLink, Heart } from "lucide-react";
import { Program } from "../../types";
import { useState } from "react";

interface ProgramCardProps {
  program: Program;
}

export const ProgramCard = ({ program }: ProgramCardProps) => {
  const [isFavorite, setIsFavorite] = useState(program.isFavorite || false);

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-md">
      <div className="relative h-48 w-full">
        {program.image ? (
          <img
            src={program.image}
            alt={program.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <span className="text-gray-400">No image available</span>
          </div>
        )}
        <button
          onClick={toggleFavorite}
          className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-sm"
        >
          <Heart
            className={`h-5 w-5 ${
              isFavorite ? "fill-red-500 text-red-500" : "text-gray-500"
            }`}
          />
        </button>
      </div>
      <CardContent className="py-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-semibold text-lg">{program.name}</h3>
            <p className="text-sm text-gray-500">{program.category}</p>
          </div>
          {program.sales && program.earned && (
            <div className="text-right">
              <p className="text-sm text-gray-500">{program.sales} sales</p>
              <p className="font-medium">${program.earned}</p>
            </div>
          )}
        </div>
        <p className="text-sm text-gray-600 mt-2">{program.description}</p>
        <div className="mt-2">
          <p className="text-sm font-medium text-affiliate-purple">{program.commission}</p>
          <p className="text-xs text-gray-500">{program.platform}</p>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between pt-0">
        <Button variant="outline" size="sm">
          Details
        </Button>
        <Button
          size="sm"
          className="flex items-center gap-1 bg-affiliate-purple hover:bg-affiliate-purple/90"
        >
          <ExternalLink className="h-4 w-4" />
          Visit
        </Button>
      </CardFooter>
    </Card>
  );
};
