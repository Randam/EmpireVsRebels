module FacebookWarGame.Client {
    export class mechLib {
        public static isRebels(faction: string): boolean {
            return (faction == 'Rebels');
        }

        public static isEmpire(faction: string): boolean {
            return (faction == 'Empire');
        }
    }
}