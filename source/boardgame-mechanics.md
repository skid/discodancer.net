---
title: Board game mechanics
date: 2020-01-15
---

## Stream-based economy
All resources are streams, so you manage bandwidths and buffers, but you don't really collect anything and make transactions, just increase and reduce bandwidth.

## Bluff victory condition
> This is actually implemented in Dune, the board game. If you're playing as Bene Geserit, you make a bet at the start of the game as to who is going to win and in which turn. However, this idea be stretched a lot further.


The basic game (non-metagame) plays out as a normal game, with several victory conditions. However, players bet on who is going to win, and how, and if they have the correct bet, they win instead. They might want to help the “proxy” player win so they can steal the win, or form an alliance. If they suspect this plan, the opponents might try to deliberately lose, or change their victory plan.

In order to “steal” a win, you need to make 2 actions, the first of which is visible to everyone. This will signal your intention to steal a win, but it might be used as a red herring to lure other players into focusing their efforts into stopping you.

The non-metagame should not be overly complex to allow people into thinking more about the metagame. The game should allow temporary alliances which can be double-edged swords - they are helping people to win regularly and to steal a win at the same time.

## A "Tragedy of the Commons" game
Players bet on “low tech” or “hi tech”.

Low tech perfects skills for survival while hi tech practices skills for advancing, but it’s dependent on infrastructure.

In a hi tech world, hi tech would win, but by competing for victory hi tech brings the world closer to an apocalypse. If the apocalypse happens, low tech has a HUGE advantage.

Now, the trick is to simulate humanity. Low tech can’t bring the world closer to apocalypse, only hi tech can do that by over-competing. There are basically 4 outcomes

1. No apocalypse, investors in low tech have a very hard time and nothing to do.
2. Apocalypse late in the game: hi tech has amassed enough advantage to win.
3. Apocalypse earlier in the game: low tech has easier time winning.
4. Apocalypse, late enough for hi tech to hedge against it.

This is basically a survival game, and mimics technologically advanced societies and environmental wear out. The "low tech" and "hi tech" concepts are not discrete things that you do in the game but are rather resulting game states of the various actions you take during the game.

### Rough sketch of mechanic
1. Apocalypse marker is moved on a track (or several mutually reinforcing tracks, like in Terraforming Mars)
2. Gain more points by bringing it closer to apocalypse
3. Hedge against apocalypse
4. Deliberately cause apocalypse (only one player can do this, to represent the minority of “crazy” people in this world)
5. Move away from apocalypse requires investment by other all players.
6. There are different game props which become unlock based on the game state. Some cards enter play when the apocalypse markers get to a certain threshold value

## A multi-person prisoner's dilemma party game
Basic rules:

### Automatic: Challenge Phase
1. A **challenge** is determined, which is a the amount of spending required by the people to avoid **crisis** and trigger **prosperity**.
2. A **reward** is determined, which is the amount that will be divided proportionally among the people if the challenge is met.
3. The challenge is unknown to the people.
4. The reward is announced to everyone.

### Election Phase
1. The people elect a ruler for the round by voting.
2. The ruler gets the following information:
   1. The challenge
   2. The individual current wealth of all people

### Tax Phase
1. The ruler determines a tax rate as a percentage between 0 and `[X]`
2. The ruler communicates the tax rate to the people.
3. The people have a chance to respond to that, and possibly overthrow the ruler. If the ruler is overthrown, the round ends with a crisis and everyone loses `[X]%` of their wealth. The challenge does not change.
4. The tax is deduced from the people's wealth, but not from the ruler (the ruler does not pay tax).
5. The ruler then decides what portion of the tax to **steal**, adding it to his wealth. This amount is known only to the ruler.
6. The rest of the collected tax is **public spending**.

### Investment Phase
1. The ruler tries to communicate to the people how much to spend to avert crisis and trigger prosperity.
2. The people individually, and in secret, decide on an amount to spend. The sum of people's spending is called **private spending**.
3. The ruler can't spend money, but he always has a "granted" investment of "1".

### Automatic: Crisis / Prosperity Phase
1. If the challenge is met or exceeded by the total of public and private spending, prosperity ensues.
2. During prosperity, each person that invested money receives more money then they spent. The ruler receives a **popularity token**, but no money since they didn't spend.
3. If the challenge is not met, then crisis happens. Nobody gains anything, and their investments and tax are wasted.

### Communication Rules
1. Players may **NEVER** utter any numbers. They may use terms as "low", "high" and compare values in an ordinal manner, but they can't say by how much.
2. The ruler can't disclose whether a person is richer than another person. He may say that there are very rich people or very poor people around.
3. The ruler may disclose that a person is richer/poorer than when he was last time in office.
4. All players may, of course, lie.

### Bankruptcy
1. If a person reaches 0 money they are officially bankrupt and they leave the game. (Why?)

### Additions
1. Alternative victory: People with lower score need an alternative path to victory, which is not related to the amount of money they have.
2. Gain in crisis, lose in prosperity: Need a way for players to bet on whether a crisis is going to happen or not, and be able to gain money during crisis and lose money during prosperity.