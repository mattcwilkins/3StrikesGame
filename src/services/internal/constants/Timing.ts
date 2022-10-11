export abstract class Timing {
  public static readonly ONE_DAY = 86400 * 1000;
  public static readonly HALF_DAY = (86400 * 1000) / 2;
  public static readonly SCORING_PERIOD_LENGTH = Timing.ONE_DAY * 5;

  public static readonly MINUTES = {
    FIVE: 300,
  };
}
