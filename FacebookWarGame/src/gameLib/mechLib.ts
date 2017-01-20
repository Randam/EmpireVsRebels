module FacebookWarGame.Client {
    export class MechLib {
        public static isRebels(faction: string): boolean {
            return (faction === "rebels");
        }

        public static isEmpire(faction: string): boolean {
            return (faction === "empire");
        }
    }
}