import {Referee} from "./sslProto"
import sslProto from "./sslProto"

const stageToText = new Map();
stageToText.set(Referee.Stage.NORMAL_FIRST_HALF_PRE, '試合はまもなく開始します');
stageToText.set(Referee.Stage.NORMAL_FIRST_HALF, '前半戦');
stageToText.set(Referee.Stage.NORMAL_HALF_TIME, 'ハーフタイム');
stageToText.set(Referee.Stage.NORMAL_SECOND_HALF_PRE, '後半戦');
stageToText.set(Referee.Stage.NORMAL_SECOND_HALF, '後半戦');
stageToText.set(Referee.Stage.EXTRA_TIME_BREAK, '試合は延長戦に突入しました');
stageToText.set(Referee.Stage.EXTRA_FIRST_HALF_PRE, '前半戦 (延長戦)');
stageToText.set(Referee.Stage.EXTRA_FIRST_HALF, '前半 (延長戦)');
stageToText.set(Referee.Stage.EXTRA_HALF_TIME, 'ハーフタイム (延長戦)');
stageToText.set(Referee.Stage.EXTRA_SECOND_HALF_PRE, '後半戦 (延長戦)');
stageToText.set(Referee.Stage.EXTRA_SECOND_HALF, '後半戦 (延長戦)');
stageToText.set(Referee.Stage.PENALTY_SHOOTOUT_BREAK, 'PK戦の準備をしています');
stageToText.set(Referee.Stage.PENALTY_SHOOTOUT, 'PK戦');
stageToText.set(Referee.Stage.POST_GAME, '試合は終了しました');

export const mapStageToText = function (stage) {
    const text = stageToText.get(stage);
    if (text !== undefined) {
        return text;
    }
    return '未知の状態: ' + stage;
};


const commandToText = new Map();
commandToText.set(Referee.Command.HALT, '停止中');
commandToText.set(Referee.Command.STOP, '中断中');
commandToText.set(Referee.Command.NORMAL_START, '進行中');
commandToText.set(Referee.Command.FORCE_START, '進行中');
commandToText.set(Referee.Command.PREPARE_KICKOFF_YELLOW, 'キックオフ');
commandToText.set(Referee.Command.PREPARE_KICKOFF_BLUE, 'キックオフ');
commandToText.set(Referee.Command.PREPARE_PENALTY_YELLOW, 'ペナルティキック');
commandToText.set(Referee.Command.PREPARE_PENALTY_BLUE, 'ペナルティキック');
commandToText.set(Referee.Command.DIRECT_FREE_YELLOW, '進行中');
commandToText.set(Referee.Command.DIRECT_FREE_BLUE, '進行中');
commandToText.set(Referee.Command.INDIRECT_FREE_YELLOW, '進行中');
commandToText.set(Referee.Command.INDIRECT_FREE_BLUE, '進行中');
commandToText.set(Referee.Command.TIMEOUT_YELLOW, 'タイムアウト');
commandToText.set(Referee.Command.TIMEOUT_BLUE, 'タイムアウト');
commandToText.set(Referee.Command.GOAL_YELLOW, 'ゴール');
commandToText.set(Referee.Command.GOAL_BLUE, 'ゴール');
commandToText.set(Referee.Command.BALL_PLACEMENT_YELLOW, 'ボール配置');
commandToText.set(Referee.Command.BALL_PLACEMENT_BLUE, 'ボール配置');

export const mapCommandToText = function (command) {
    const text = commandToText.get(command);
    if (text !== undefined) {
        return text;
    }
    return '未知のコマンド: ' + command;
};


const oppositeTeam = function (team) {
    if (team === sslProto.Team.BLUE) {
        return sslProto.Team.YELLOW;
    } else if (team === sslProto.Team.YELLOW) {
        return sslProto.Team.BLUE;
    }
    return 'Unknown;';
};

const formatTeam = function (team) {
    if (team === sslProto.Team.BLUE) {
        return '<span class="team-blue">青チーム</span>';
    } else if (team === sslProto.Team.YELLOW) {
        return '<span class="team-yellow">黄チーム</span>';
    }
    return '未知のチーム';
};

const teamAndBot = function (event) {
    if (event.byTeam === undefined) {
        return '';
    }
    if (event.byBot === undefined || !event.hasOwnProperty('byBot')) {
        return formatTeam(event.byTeam);
    }
    return formatTeam(event.byTeam) + ' の ' + event.byBot;
};

const radToDeg = function (rad) {
    return Math.ceil(rad * 180 / Math.PI) + '°';
};

const velocity = function (v) {
    return '秒速' + Number(Math.ceil(v * 10) / 10).toFixed(1) + 'メートル';
};

const distance = function (v) {
    return Number(Math.ceil(v * 100) / 100).toFixed(2) + 'メートル';
};

const seconds = function (v) {
    return Number(Math.ceil(v * 10) / 10).toFixed(1) + '秒';
};

export const mapGameEventToText = function (event) {
    if (event.prepared != null) {
        return `Prepared after ${seconds(event.prepared.timeTaken)}`;
    }
    if (event.noProgressInGame != null) {
        return `${seconds(event.noProgressInGame.time)} の間進展がありませんでした`;
    }
    if (event.placementFailed != null) {
        return `${teamAndBot(event.placementFailed)} はボールの配置に失敗しました `
            + ` (目標位置までの距離: ${distance(event.placementFailed.remainingDistance)})`;
    }
    if (event.placementSucceeded != null) {
        return `${teamAndBot(event.placementSucceeded)} はボールの配置に成功しました `
            + `距離: ${distance(event.placementSucceeded.distance)} `
            + `時間: ${seconds(event.placementSucceeded.timeTaken)} `
            + `精度: ${distance(event.placementSucceeded.precision)}`;
    }
    if (event.botSubstitution != null) {
        return `${teamAndBot(event.botSubstitution)} はロボットの置換を要請しています`;
    }
    if (event.tooManyRobots != null) {
        return `${teamAndBot(event.tooManyRobots)} のロボットがフィールド上に多すぎます`;
    }
    if (event.ballLeftFieldTouchLine != null) {
        return `${teamAndBot(event.ballLeftFieldTouchLine)} はタッチラインの外へボールを蹴りました`;
    }
    if (event.ballLeftFieldGoalLine != null) {
        return `${teamAndBot(event.ballLeftFieldGoalLine)} はゴールラインの外へボールを蹴りました`;
    }
    if (event.possibleGoal != null) {
        return `${teamAndBot(event.possibleGoal)} はゴールした可能性があります`;
    }
    if (event.goal != null) {
        return `${teamAndBot(event.goal)} はゴールしました`;
    }
    if (event.indirectGoal != null) {
        return `${teamAndBot(event.indirectGoal)} は不正なインダイレクトゴールを行いました`;
    }
    if (event.chippedGoal != null) {
        return `${teamAndBot(event.chippedGoal)} はゴールへチップキックしました`;
    }
    if (event.aimlessKick != null) {
        return `${teamAndBot(event.aimlessKick)} はあてもなくキックをしました`;
    }
    if (event.kickTimeout != null) {
        return `${teamAndBot(event.kickTimeout)} `
            + ` は ${seconds(event.kickTimeout.time)} 以内にキックを行いませんでした`;
    }
    if (event.keeperHeldBall != null) {
        return `${teamAndBot(event.keeperHeldBall)}'のキーパーは`
            + ` ${seconds(event.keeperHeldBall.duration)}　の間ボールを保持しました`;
    }
    if (event.attackerDoubleTouchedBall != null) {
        return `${teamAndBot(event.attackerDoubleTouchedBall)} はボールに複数回触りました`;
    }
    if (event.attackerTouchedBallInDefenseArea != null) {
        return `${teamAndBot(event.attackerTouchedBallInDefenseArea)} は相手チームのディフェンスエリアでボールに触りました`;
    }
    if (event.attackerTouchedOpponentInDefenseArea != null) {
        let byTeam = event.attackerTouchedOpponentInDefenseArea.byTeam;
        let otherTeam = oppositeTeam(byTeam);
        let violator = event.attackerTouchedOpponentInDefenseArea.byBot;
        let victim = event.attackerTouchedOpponentInDefenseArea.victim;
        return `${formatTeam(byTeam)} の ${violator} はディフェンスエリアで ${formatTeam(otherTeam)} の ${victim} に接触しました`;
    }
    if (event.attackerTouchedOpponentInDefenseAreaSkipped != null) {
        let byTeam = event.attackerTouchedOpponentInDefenseAreaSkipped.byTeam;
        let otherTeam = oppositeTeam(byTeam);
        let violator = event.attackerTouchedOpponentInDefenseAreaSkipped.byBot;
        let victim = event.attackerTouchedOpponentInDefenseAreaSkipped.victim;
        return `${formatTeam(byTeam)} の ${violator} はディフェンスエリアで ${formatTeam(otherTeam)} の ${victim} に接触しました`;
    }
    if (event.botDribbledBallTooFar != null) {
        return `${teamAndBot(event.botDribbledBallTooFar)} は規定以上の距離ドリブルをしました`;
    }
    if (event.botKickedBallTooFast != null) {
        return `${teamAndBot(event.botKickedBallTooFast)} は規定よりも高速にボールを蹴りました` +
            `(${velocity(event.botKickedBallTooFast.initialBallSpeed)})`;
    }
    if (event.attackerTooCloseToDefenseArea != null) {
        return `${teamAndBot(event.attackerTooCloseToDefenseArea)} は相手チームのディフェンスエリアに規定以上近づきました `
            + `(${distance(event.attackerTooCloseToDefenseArea.distance)})`;
    }
    if (event.botInterferedPlacement != null) {
        return `${teamAndBot(event.botInterferedPlacement)} はボール配置に干渉しました`;
    }
    if (event.botCrashDrawn != null) {
        let crashSpeed = event.botCrashDrawn.crashSpeed;
        let crashAngle = event.botCrashDrawn.crashAngle;
        let speedDiff = event.botCrashDrawn.speedDiff;
        let text = `青チームのロボット ${event.botCrashDrawn.botBlue} と黄チームのロボット ${event.botCrashDrawn.botYellow} は衝突しました`;
        if (crashSpeed > 0) {
            text += ` 速度: ${velocity(crashSpeed)}`
        }
        if (crashAngle > 0) {
            text += ` 角度: ${radToDeg(crashAngle)}`
        }
        if (speedDiff > 0) {
            text += ` (Δ ${velocity(speedDiff)})`
        }
        return text;
    }
    if (event.botCrashUnique != null) {
        let byTeam = event.botCrashUnique.byTeam;
        let otherTeam = oppositeTeam(byTeam);
        let violator = event.botCrashUnique.violator;
        let victim = event.botCrashUnique.victim;
        let crashSpeed = event.botCrashUnique.crashSpeed;
        let crashAngle = event.botCrashUnique.crashAngle;
        let speedDiff = event.botCrashUnique.speedDiff;
        let text = `${formatTeam(byTeam)} の ${violator}`
            + ` は ${formatTeam(otherTeam)} の ${victim} と衝突しました`;
        if (crashSpeed > 0) {
            text += ` 速度: ${velocity(crashSpeed)}`
        }
        if (crashAngle > 0) {
            text += ` 角度: ${radToDeg(crashAngle)}`
        }
        if (speedDiff > 0) {
            text += ` (Δ ${velocity(speedDiff)})`
        }
        return text;
    }
    if (event.botCrashUniqueSkipped != null) {
        let byTeam = event.botCrashUniqueSkipped.byTeam;
        let otherTeam = oppositeTeam(byTeam);
        let violator = event.botCrashUniqueSkipped.violator;
        let victim = event.botCrashUniqueSkipped.victim;
        let crashSpeed = event.botCrashUniqueSkipped.crashSpeed;
        let crashAngle = event.botCrashUniqueSkipped.crashAngle;
        let speedDiff = event.botCrashUniqueSkipped.speedDiff;
        let text = `スキップ: ${formatTeam(byTeam)} の ${violator}`
            + ` は ${formatTeam(otherTeam)} の ${victim} と衝突しました`;
        if (crashSpeed > 0) {
            text += ` 速度: ${velocity(crashSpeed)}`
        }
        if (crashAngle > 0) {
            text += ` 角度: ${radToDeg(crashAngle)}`
        }
        if (speedDiff > 0) {
            text += ` (Δ ${velocity(speedDiff)})`
        }
        return text;
    }
    if (event.botPushedBot != null) {
        let byTeam = event.botPushedBot.byTeam;
        let otherTeam = oppositeTeam(byTeam);
        let violator = event.botPushedBot.violator;
        let victim = event.botPushedBot.victim;
        let dist = event.botPushedBot.pushedDistance;
        let text = `${formatTeam(byTeam)} の ${violator} は`
            + ` ${formatTeam(otherTeam)} の ${victim} を押しました`;
        if (dist > 0) {
            text += ` 距離: ${distance(dist)}`
        }
        return text;
    }
    if (event.botPushedBotSkipped != null) {
        let byTeam = event.botPushedBotSkipped.byTeam;
        let otherTeam = oppositeTeam(byTeam);
        let violator = event.botPushedBotSkipped.violator;
        let victim = event.botPushedBotSkipped.victim;
        let dist = event.botPushedBotSkipped.pushedDistance;
        let text = `スキップ: ${formatTeam(byTeam)} の ${violator} は`
            + ` ${formatTeam(otherTeam)} の ${victim} を押しました`;
        if (dist > 0) {
            text += ` 距離: ${distance(dist)}`
        }
        return text;
    }
    if (event.botHeldBallDeliberately != null) {
        return `${teamAndBot(event.botHeldBallDeliberately)} `
            + `は故意にボールを ${event.botHeldBallDeliberately.duration} の間保持し続けました`;
    }
    if (event.botTippedOver != null) {
        return `${teamAndBot(event.botTippedOver)} はチップキックをしました`;
    }
    if (event.botTooFastInStop != null) {
        return `${teamAndBot(event.botTooFastInStop)} `
            + ` はゲーム中断中に規定速度を超えました (${velocity(event.botTooFastInStop.speed)})`;
    }
    if (event.defenderTooCloseToKickPoint != null) {
        return `${teamAndBot(event.defenderTooCloseToKickPoint)} `
            + ` はキックポイントに過剰接近しました (${distance(event.defenderTooCloseToKickPoint.distance)})`;
    }
    if (event.defenderInDefenseAreaPartially != null) {
        return `${teamAndBot(event.defenderInDefenseAreaPartially)} `
            + `は自チームのディフェンスエリアに一部分侵入してボールに触りました `
            + `(${distance(event.defenderInDefenseAreaPartially.distance)})`;
    }
    if (event.defenderInDefenseArea != null) {
        return `${teamAndBot(event.defenderInDefenseArea)} `
            + `は自チームのディフェンスエリアに侵入してボールに触りました `
            + `(${distance(event.defenderInDefenseArea.distance)})`;
    }
    if (event.multipleCards != null) {
        return `${teamAndBot(event.multipleCards)} は複数枚のカードを宣告されています`;
    }
    if (event.multiplePlacementFailures != null) {
        return `${teamAndBot(event.multiplePlacementFailures)} はボール配置に複数回失敗しました`;
    }
    if (event.multipleFouls != null) {
        return `${teamAndBot(event.multipleFouls)} は複数回のファウルを宣告されています`;
    }
    if (event.unsportingBehaviorMinor != null) {
        return `${teamAndBot(event.unsportingBehaviorMinor)} によるサポートされない挙動: `
            + event.unsportingBehaviorMinor.reason;
    }
    if (event.unsportingBehaviorMajor != null) {
        return `${teamAndBot(event.unsportingBehaviorMajor)} による主要なサポートされない挙動: `
            + event.unsportingBehaviorMajor.reason;
    }
    return '不明なゲームイベント';
};
