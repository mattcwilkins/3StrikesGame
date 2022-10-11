import { DynamoDBService } from "./base/DynamoDBService";
import { Identifier } from "../../interfaces/internal/io/Database";

export type CountMetric = {
  id: Identifier;
  count: number;
};

/**
 * metrics table.
 */
export class MetricsService extends DynamoDBService<CountMetric> {
  public constructor() {
    super("metrics");
  }

  public async increment(countMetricId: Identifier<CountMetric>) {
    const accessor = await this.ready;
    const current = (await accessor.get(countMetricId).catch(() => null)) || {
      id: countMetricId,
      count: 0,
    };
    current.count |= 0;
    current.count += 1;
    await accessor.set(current);
  }
}
