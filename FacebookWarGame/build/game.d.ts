/// <reference path="../references.d.ts" />
declare module System {
    module Collections {
        module Generic {
            interface List<T> {
                new (array: T[]): any;
                Add: (item: T) => List<T>;
                Aggregate: {
                    <TResult>(Func: (current: T, next: T) => TResult): T;
                    <TResult>(Func: (current: T, next: T) => TResult, seed: T): T;
                };
                All: (Func: (x: T) => boolean) => boolean;
                Any: (Func: (x: T) => boolean) => boolean;
                Average: {
                    (): number;
                    (Func: (x: T) => number): number;
                };
                Concat: (array: T[]) => List<T>;
                Contains: {
                    (item: T): boolean;
                    (item: T, comparer: IEqualityComparer<T>): boolean;
                };
                Count: {
                    (): number;
                    (Func: (x: T) => boolean): number;
                };
                Distinct: {
                    (): List<T>;
                    (comparer: IEqualityComparer<T>): List<T>;
                };
                DistinctBy: {
                    <U>(Func: (x: T) => U): List<T>;
                    <U>(Func: (x: T) => U, comparer: IEqualityComparer<T>): List<T>;
                };
                ElementAt: (index: number) => T;
                ElementAtOrDefault: (index: number) => T;
                Except: {
                    (except: T[]): List<T>;
                    (except: T[], comparer: IEqualityComparer<T>): List<T>;
                };
                First: {
                    (): T;
                    (Func: (x: T) => boolean): T;
                };
                FirstOrDefault: {
                    (): T;
                    (Func: (x: T) => boolean): T;
                };
                ForEach: (Action: (e: T, index: number) => any) => void;
                GroupBy: {
                    <TKey, TElement>(keySelector: (e: T) => TKey): List<any>;
                    <TKey, TElement>(keySelector: (e: T) => TKey, elementSelector: (e: T) => TElement, comparer: IEqualityComparer<TKey>): List<any>;
                };
                IndexOf: {
                    (e: T): number;
                    (e: T, comparer: IEqualityComparer<T>): number;
                };
                Intersect: {
                    (array: T[]): List<T>;
                    (array: T[], comparer: IEqualityComparer<T>): List<T>;
                };
                Join: {
                    <TInner, TKey, TResult>(array: TInner[], outerKeySelector: (e: T) => TKey, innerKeySelector: (e: TInner) => TKey, resultSelector: (outer: T, inner: TInner) => TResult): List<TResult>;
                    <TInner, TKey, TResult>(array: TInner[], outerKeySelector: (e: T) => TKey, innerKeySelector: (e: TInner) => TKey, resultSelector: (outer: T, inner: TInner) => TResult, comparer: IEqualityComparer<TKey>): List<TResult>;
                };
                Last: {
                    (): T;
                    (Func: (x: T) => boolean): T;
                };
                LastOrDefault: {
                    (): T;
                    (Func: (x: T) => boolean): T;
                };
                Max: {
                    <TResult>(): TResult;
                    <TResult>(Func: (x: T) => TResult): TResult;
                };
                Min: {
                    <TResult>(): TResult;
                    <TResult>(Func: (x: T) => TResult): TResult;
                };
                OrderBy: {
                    <TKey>(Func: (x: T) => TKey): List<T>;
                    <TKey>(Func: (x: T) => TKey, comparer: (a: TKey, b: TKey) => number): List<T>;
                };
                OrderByDescending: {
                    <TKey>(Func: (x: T) => TKey): List<T>;
                    <TKey>(Func: (x: T) => TKey, comparer: (a: TKey, b: TKey) => number): List<T>;
                };
                RemoveAll: (Func: (x: T) => boolean) => List<T>;
                Reverse: () => List<T>;
                Select: {
                    <TResult>(selector: (e: T) => TResult): List<TResult>;
                    <TResult>(selector: (e: T) => TResult, i: number): List<TResult>;
                };
                SelectMany: {
                    <TResult>(selector: (e: T) => T[]): List<TResult>;
                    <TResult>(selector: (e: T) => T[], resultSelector: (e: T) => TResult): List<TResult>;
                };
                SequenceEqual: {
                    (second: T[]): boolean;
                    (second: T[], comparer: (a: T, b: T) => boolean): boolean;
                };
                Single: {
                    (): T;
                    (Func: (x: T) => boolean): T;
                };
                SingleOrDefault: {
                    (): T;
                    (Func: (x: T) => boolean): T;
                };
                Skip: (count: number) => List<T>;
                SkipWhile: (Func: (x: T) => boolean) => List<T>;
                Sum: {
                    (): number;
                    (Func: (x: T) => number): number;
                };
                Take: (count: number) => List<T>;
                TakeWhile: (Func: (x: T) => boolean) => List<T>;
                Union: {
                    (array: T[]): List<T>;
                    (array: T[], comparer?: IEqualityComparer<T>): List<T>;
                };
                Where: (Func: (x: T) => boolean) => List<T>;
                Zip: {
                    <TInner, TResult>(array: TInner[], resultSelector: (o: T, i: TInner) => TResult): List<TResult>;
                };
                ToArray: () => T[];
            }
        }
    }
}
import List = System.Collections.Generic.List;
interface Array<T> {
    ToList<T>(): List<T>;
}
declare module System {
    module Collections {
        interface IEqualityComparer<T> {
            Equals: (x: T, y: T) => boolean;
            GetHashCode: (obj: T) => number;
        }
    }
}
import IEqualityComparer = System.Collections.IEqualityComparer;
declare module System {
    module Collections {
        interface IGrouping<TKey, T> {
            Key: TKey;
            Elements: T[];
        }
    }
}
import IGrouping = System.Collections.IGrouping;
interface Object {
    GetHashCode(e: any): number;
}
interface Object {
    IsPlain(e: any): boolean;
}
interface JSON {
    StringifyNonCircular(obj: any): string;
}
declare module FacebookWarGame.Client {
    class FacebookComment {
        static list: Array<FacebookComment>;
        static updated: boolean;
        created_time: Date;
        fromName: string;
        fromId: string;
        message: string;
        id: string;
        refreshId: number;
        getFaction(): string;
        isFaction(): boolean;
        static refreshList(pageId: string, postId: string, access_token: string, refreshId: number): void;
        static addRecordsFromJSON(jsonResult: any, refreshId: number): void;
        static getNew(refreshId: number): Array<FacebookComment>;
        static findByFromId(fromId: string): FacebookComment;
        static findById(id: string): FacebookComment;
    }
}
declare module FacebookWarGame.Client {
    class FacebookTag {
        static list: Array<FacebookTag>;
        static updated: boolean;
        userId: string;
        tagId: string;
        refreshId: number;
        constructor(userId: string, tagId: string, refreshId: number);
        static exists(taggedId: string): boolean;
        static refreshList(access_token: string, refreshId: number): void;
    }
}
declare module FacebookWarGame.Client {
    class User {
        static list: Array<User>;
        name: string;
        fbId: string;
        faction: string;
        score: number;
        respawns: number;
        kills: number;
        constructor(name?: string, faction?: string, fbId?: string);
        static findById(fbId: string): User;
        static findByName(name: string): User;
        static clearUserData(): void;
    }
}
declare module FacebookWarGame.Client {
    class GameEngine extends Phaser.Game {
        constructor();
    }
}
declare let access_token: string;
declare let pageId: string;
declare let postId: string;
declare let refreshId: number;
declare let game: FacebookWarGame.Client.GameEngine;
declare function addUnit(name: string, fbId: string, faction: string): void;
declare function processFacebookData(): void;
declare function updateGame(): void;
declare module FacebookWarGame.Client {
    class CountDownTimer {
        endTime: number;
        hours: number;
        mins: number;
        time: Date;
        constructor(minutes: number, seconds: number);
        getTimer(): string;
        getSecondsLeft(): number;
        timerExpired(): boolean;
        private twoDigits(n);
    }
}
declare module FacebookWarGame.Client {
    class MechLib {
        static isRebels(faction: string): boolean;
        static isEmpire(faction: string): boolean;
    }
}
declare module FacebookWarGame.Client {
    enum Direction {
        Up = 1,
        Right = 2,
        Down = 3,
        Left = 4,
    }
}
declare module FacebookWarGame.Client {
    class Bullet extends Phaser.Sprite {
        firedBy: Player;
        constructor(game: Phaser.Game, x: number, y: number);
    }
}
declare module FacebookWarGame.Client {
    class Player extends Phaser.Sprite {
        destination: Phaser.Point;
        direction: Direction;
        game: Phaser.Game;
        bulletsToFire: number;
        user: User;
        private walkingSound;
        private firingSound;
        private bullets;
        private bulletTime;
        private faction;
        private nameLabel;
        private score;
        constructor(faction: string, game: Phaser.Game, x: number, y: number, bullets: Phaser.Group);
        kill(): Phaser.Sprite;
        update(): void;
        private destinationReached();
        private setNewDestination();
        private fireBullet();
    }
}
declare module FacebookWarGame.Client {
    class Arena extends Phaser.State {
        bgm: Phaser.Sound;
        rebels: Phaser.Group;
        empire: Phaser.Group;
        map: Phaser.Tilemap;
        leader: User;
        leaderLabelText: Phaser.Text;
        leaderNameText: Phaser.Text;
        leaderFactionText: Phaser.Text;
        leaderScoreText: Phaser.Text;
        timerText: Phaser.Text;
        bulletsRebels: Phaser.Group;
        bulletsEmpire: Phaser.Group;
        explosions: Phaser.Group;
        explodingSound: Array<Phaser.Sound>;
        countDownTimer: CountDownTimer;
        create(): void;
        update(): void;
        addEmpireUnit(user: User): Player;
        addRebelsUnit(user: User): Player;
        addUnitForUser(user: User): void;
        private addUnit(user, health, units, startX, startY, destX, destY);
        private rebelHit(bullet, unit);
        private empireHit(bullet, unit);
        private unitHit(bullet, unit);
        private initUnitGroup(faction);
        private initBulletGroup(faction);
        startMusic(): void;
        roundNext(): void;
    }
}
declare module FacebookWarGame.Client {
    class Boot extends Phaser.State {
        preload(): void;
        create(): void;
    }
}
declare module FacebookWarGame.Client {
    class Preloader extends Phaser.State {
        loaderText: Phaser.Text;
        preload(): void;
        create(): void;
        startArena(): void;
    }
}
declare module FacebookWarGame.Client {
    class RoundStart extends Phaser.State {
        background: Phaser.TileSprite;
        countDownTimer: CountDownTimer;
        leader: User;
        leaderLabelText: Phaser.Text;
        leaderNameText: Phaser.Text;
        leaderFactionText: Phaser.Text;
        leaderScoreText: Phaser.Text;
        timerText: Phaser.Text;
        secondsLeft: number;
        init(leader: User): void;
        create(): void;
        update(): void;
        fadeOut(): void;
        startGame(): void;
    }
}
