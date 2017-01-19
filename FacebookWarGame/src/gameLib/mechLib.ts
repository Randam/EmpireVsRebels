module FacebookWarGame.Client {
    export class MechLib {
        public static isRebels(faction: string): boolean {
            return (faction === "Rebels");
        }

        public static isEmpire(faction: string): boolean {
            return (faction === "Empire");
        }
    }
}