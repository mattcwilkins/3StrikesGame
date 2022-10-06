export interface Deployer {
  /**
   * Statelessly deploy resources.
   */
  deploy(): Promise<void>;

  /**
   * Statelessly destroy resources.
   */
  destroy(): Promise<void>;
}
