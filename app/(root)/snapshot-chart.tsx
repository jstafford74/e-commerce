"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { useMemo, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

type SelectedOptions =
  | "total"
  | "new_york"
  | "connecticut"
  | "texas"
  | "massachusetts"
  | "new_jersey"
  | "north_carolina"
  | "maryland"
  | "florida"
  | "california";

const SearchTerms = [
  "total",
  "new_york",
  "connecticut",
  "texas",
  "massachusetts",
  "new_jersey",
  "north_carolina",
  "maryland",
  "florida",
  "california",
];
export type TotalSnapshot = {
  _id: string;
  total: number;
  new_york: number;
  connecticut: number;
  texas: number;
  massachusetts: number;
  new_jersey: number;
  maryland: number;
  north_carolina: number;
  florida: number;
  california: number;
};

export default function SnapshotChart({
  snapshotData,
}: {
  snapshotData: TotalSnapshot[];
}) {
  const [selectedRegion, setSelectedRegion] =
    useState<SelectedOptions>("total");

  // Handle checkbox changes
  const handleCheckboxChange = (region: SelectedOptions) => {
    
    setSelectedRegion(region); // Update the selected region to the clicked checkbox
  };

  const filteredData = useMemo(() => {
    return snapshotData.map((region) => {
      return {
        _id: region._id,
        value: region[selectedRegion],
      };
    });
  }, [selectedRegion, snapshotData]);

  const initialValue = filteredData.length > 0 ? filteredData[0].value : 0; // Fallback to 0 if no data is available

  const minY = initialValue * 0.8; // 20% below the first value
  const lastValue =
    filteredData.length > 0 ? filteredData[filteredData.length - 1].value : 0;
  const maxY = lastValue * 1.15; // 15% above the last value

  const roundToNearest5 = (value: number) => {
    return (Math.round(value / 5) * 5).toString();
  };

  return (
    <div className="grid grid-cols-4 gap-4">
      <div className="col-span-1 p-4">
        <h2>Select Options:</h2>

        {SearchTerms.map((eachTerm) => {
          return (
            <div key={eachTerm}>
              <Checkbox
                checked={selectedRegion === eachTerm}
                onCheckedChange={() =>
                  handleCheckboxChange(eachTerm as SelectedOptions)
                }
                name={eachTerm}
                className="mx-3"
              />

              <label htmlFor={eachTerm}>{eachTerm.toUpperCase()}</label>
            </div>
          );
        })}
      </div>
      <div className="col-span-3 p-4">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={filteredData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="_id" />
            <YAxis domain={[minY, maxY]} tickFormatter={roundToNearest5} />{" "}
            {/* Set Y-axis domain */}
            <Tooltip />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#8884d8"
              strokeWidth={2}
            />{" "}
            {/* Using the value based on selected region */}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
