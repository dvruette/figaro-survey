import os, itertools
import pandas as pd

csv_file = os.getenv('CSV_FILE', './answers.csv')

def remove_invalid_answers(df: pd.DataFrame, min_playback_time=2, invalid_user_threshold=1):
  invalid_answers = df.loc[(df.playbackTimeA < min_playback_time) | (df.playbackTimeB < min_playback_time)]
  invalid_users = invalid_answers.groupby('uid').count()['a'].reset_index().rename(columns={'a': 'count'})
  invalid_users = invalid_users[invalid_users['count'] >= invalid_user_threshold]['uid']
  # drop invalid users
  for user in invalid_users:
    df = df.drop(df.loc[df['uid'] == user].index)
  # drop dev answers
  df = df.drop(df.loc[df.environment == 'development'].index)
  return df

def get_winrates(rounds: pd.DataFrame):
  wins = rounds.groupby('model').sum()['score']
  N = rounds.groupby('model').count()['score']
  winrates = pd.DataFrame({ 'wins': wins, 'losses': N - wins, 'rounds': N, 'winrate': wins / N })
  return winrates.sort_values('winrate', ascending=False)

def main():
  raw_df = pd.read_csv(csv_file, index_col=False)
  df = remove_invalid_answers(raw_df)

  wins = df[['winner', 'loser', 'winnerSample']].rename(columns={'winner': 'model', 'loser': 'against', 'winnerSample': 'sample'}).dropna()
  losses = df[['winner', 'loser', 'loserSample']].rename(columns={'loser': 'model', 'winner': 'against', 'loserSample': 'sample'}).dropna()
  wins['score'] = 1
  losses['score'] = 0
  rounds = pd.concat([wins, losses])

  print("########## PARTICIPANTS ##########")
  print(f"Num. of answers:   {len(df):3d}", )
  print(f"Num. participants: {len(df['uid'].unique()):3d}")
  print(f"Avg. answer count: {df.groupby('uid').count()['a'].mean():3.1f}")
  print()
  
  print("########## WINRATES ##########")
  print(get_winrates(rounds))
  print()

  print("########## WINRATES VS. GROUND TRUTH ##########")
  print(get_winrates(rounds.loc[rounds.against == 'original']))
  print()

  models = rounds.model.unique()
  pairs = itertools.combinations(models, 2)
  pairings = rounds.groupby(['model', 'against']).count()['score']
  pair_counts = pd.DataFrame([{ 'pair': set([m1, m2]), 'count': pairings.loc[m1, m2] + pairings.loc[m2, m1] } for m1, m2 in pairs]).set_index('pair')
  print("########## PAIRINGS ##########")
  print(pair_counts)
  print()

  print("########## TOP 10 SAMPLES ##########")
  print((rounds.groupby('sample').sum()['score'] / rounds.groupby('sample').count()['score']).sort_values(ascending=False).iloc[:10])
  print()

  playback_a = df[['a', 'playbackTimeA']].rename(columns={'a': 'model', 'playbackTimeA': 'playback_time'}).dropna()
  playback_b = df[['b', 'playbackTimeB']].rename(columns={'b': 'model', 'playbackTimeB': 'playback_time'}).dropna()
  playbacks = pd.concat([playback_a, playback_b])
  print("########## PLAYBACK TIMES ##########")
  print(playbacks.groupby('model').mean().sort_values('playback_time', ascending=False))
  print()


if __name__ == '__main__':
  main()