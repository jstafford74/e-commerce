"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { SearchTerms } from "@/lib/constants";
import { SelectedOptions, TotalSnapshot } from "@/lib/validators";
import { useMemo, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Label,
} from "recharts";
import { Props } from "recharts/types/cartesian/Line";


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
    const roundedValue = Math.round(value / 5) * 5; // Round to the nearest 5
    return roundedValue.toLocaleString();
  };

  type CustomTickProps = Props & {
    payload: {
      value: string | number; // You can adjust this depending on what type your ticks will use
    };
  };

  const CustomXAxisTick: React.FC<CustomTickProps> = ({ x, y, payload }) => {
    return (
      <text x={x} y={y} dy={16} textAnchor="middle" fill="#666" fontSize={12}>
        {payload.value}
      </text>
    );
  };

  const CustomYAxisTick: React.FC<CustomTickProps> = ({ x, y, payload }) => {
    let openings;
    if (typeof payload.value === "number") {
      openings = roundToNearest5(payload.value);
    } else {
      openings = roundToNearest5(Number(payload.value));
    }
    return (
      <text x={x} y={y} dy={16} textAnchor="end" fill="#666" fontSize={14}>
        {openings}
      </text>
    );
  };

  return (
    <div className="grid grid-cols-4 gap-4">
      <div className="col-span-1 p-4">
        <h2><strong>Search Terms:</strong></h2>

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
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={filteredData}
            margin={{
              top: 20,
              right: 30,
              left: 30,
              bottom: 30,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="_id"
              tick={
                <CustomXAxisTick
                  payload={{
                    value: "_id",
                  }}
                />
              }
            >
              <Label
                value="Observation Date"
                offset={10}
                position="bottom"
                style={{ fontWeight: "bold" }}
              />
            </XAxis>
            <YAxis
              label={{
                value: "# of Openings",
                angle: 0,
                position: "top",
                offset: 0,
                style: { fontWeight: "bold" },
              }}
              domain={[minY, maxY]}
              tick={
                <CustomYAxisTick
                  payload={{
                    value: "value",
                  }}
                />
              }
            />
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
