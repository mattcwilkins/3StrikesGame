import React from "react";

export interface CardProps {
  title?: string;
  children?: React.ReactNode;
}

export function Card({ title, children }: CardProps) {
  return (
    <div className="col-lg-3">
      <div className="card scorecard">
        <div className="card-body">
          <h5 className="display-6">{title}</h5>
          <div className="card-text">{children}</div>
        </div>
      </div>
    </div>
  );
}
