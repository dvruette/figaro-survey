import os, itertools
import pandas as pd
import matplotlib.pyplot as plt
import scipy.stats as st
import seaborn as sns
import numpy as np
from datetime import datetime

csv_file = os.getenv('CSV_FILE', './answers.csv')

def remove_invalid_answers(df: pd.DataFrame, min_playback_time=2, invalid_user_threshold=1):
  invalid_answers = df.loc[(df.playbackTimeA < min_playback_time) & (df.playbackTimeB < min_playback_time)]
  invalid_users = invalid_answers.groupby('uid').count()['a'].reset_index().rename(columns={'a': 'count'})
  invalid_users = invalid_users[invalid_users['count'] >= invalid_user_threshold]['uid']
  print(f"Num. invalid answers: {len(invalid_answers)}")
  print(f"Num. invalid users:   {len(invalid_users)}")

  # drop invalid answers
  df = df.drop(invalid_answers.index)
  # drop invalid users
  for user in invalid_users:
    df = df.drop(df.loc[df['uid'] == user].index)
  # drop dev answers
  df = df.drop(df.loc[df.environment == 'development'].index)
  return df

def get_rounds(df: pd.DataFrame):
  wins = df[['winner', 'loser', 'winnerSample']].rename(columns={'winner': 'model', 'loser': 'against', 'winnerSample': 'sample'}).dropna()
  losses = df[['winner', 'loser', 'loserSample']].rename(columns={'loser': 'model', 'winner': 'against', 'loserSample': 'sample'}).dropna()
  wins['score'] = 1
  losses['score'] = 0
  return pd.concat([wins, losses])

def get_winrates(rounds: pd.DataFrame):
  wins = rounds.groupby('model').sum()['score']
  std = rounds.groupby('model').std()['score']
  N = rounds.groupby('model').count()['score']
  winrates = pd.DataFrame({ 'wins': wins, 'losses': N - wins, 'rounds': N, 'winrate': wins / N, 'std': std })
  return winrates.sort_values('winrate', ascending=False)

def main():
  print("########## PARTICIPANTS ##########")
  raw_df = pd.read_csv(csv_file, index_col=False)
  # pd.concat([raw_df['playbackTimeA'], raw_df['playbackTimeB']]).hist(bins=40)
  # plt.show()
  df = remove_invalid_answers(raw_df, min_playback_time=4, invalid_user_threshold=4)


  print('First answer:', datetime.fromtimestamp(df.created.min() / 1000))
  print('Most recent answer:', datetime.fromtimestamp(df.created.max() / 1000))
  print(f"Num. of answers:   {len(df):3d}", )
  print(f"Num. participants: {len(df['uid'].unique()):3d}")
  print(f"Avg. answer count: {df.groupby('uid').count()['a'].mean():3.1f}")
  print()

  dates = df.copy()
  dates.created = dates.created.apply(lambda t: datetime.fromtimestamp(t / 1000).strftime("%Y-%m-%d"))
  uids = dates.groupby('created').agg({"uid": "nunique"})
  answers = dates.groupby('created').count()['a']
  pd.concat([answers, uids], axis=1).rename(columns={'a': 'answers', 'uid': 'users'}).plot.bar()
  plt.show()

  pd.concat([df['playbackTimeA'], df['playbackTimeB']]).hist(bins=40)
  plt.title('Playback Times')
  plt.show()

  df.groupby('uid').count()['a'].hist(bins=30)
  plt.show()
  
  print("########## WINRATES ##########")
  random_rounds = get_rounds(df.loc[df['uniformChoice'] != False])
  random_winrates = get_winrates(random_rounds)
  print(random_winrates)
  print()

  print("########## WINRATES VS. GROUND TRUTH ##########")
  rounds = get_rounds(df)
  orig_rounds = rounds.loc[rounds.against == 'original']
  winrates = get_winrates(orig_rounds).sort_values('winrate', ascending=False)
  print(winrates)
  print()

  plt.rcParams.update({'figure.autolayout': True})
  plt.figure(figsize=(7, 3.25))
  cis = []
  for model in ['desc2seq-both', 'autoencoder', 'baseline', 'muse-morphose']:
    rs = orig_rounds.loc[orig_rounds.model == model]
    p = rs.score.mean()
    ci = 1.645*np.sqrt(p * (1 - p) / len(rs))
    cis.append(ci)
  plt.style.use('seaborn-whitegrid')
  ax = sns.barplot(y=['FIGARO', 'Choi et al.', 'Huang et al.', 'Wu & Yang'], x=winrates['winrate'].to_numpy(), palette='RdYlBu_d')
  ax.errorbar(y=range(4), x=winrates['winrate'].to_numpy(), xerr=cis, fmt='.k')
  ax.set(xlabel='Win rate vs. ground truth', ylabel=None)
  plt.show()

  print("########## PAIRINGS ##########")
  models = random_rounds.model.unique()
  pairs = list(itertools.combinations(models, 2))
  rows = []
  for m1, m2 in pairs:
    pair_rounds = random_rounds.loc[(random_rounds['model'] == m1) & (random_rounds['against'] == m2)]
    stats, p_value = st.wilcoxon(pair_rounds['score'], 1 - pair_rounds['score'], alternative='greater', correction=True)
    if p_value < 0.5:
      rows.append({ 'winner': m1, 'loser': m2, 'winrate': pair_rounds.score.mean(), 'p_val': p_value, 'N': len(pair_rounds), 'W': stats})
    else:
      rows.append({ 'winner': m2, 'loser': m1, 'winrate': 1 - pair_rounds.score.mean(), 'p_val': 1 - p_value, 'N': len(pair_rounds), 'W': stats})
  print(pd.DataFrame(rows))
  print()

  print("########## TOP 10 GENERATED SAMPLES ##########")
  algo_rounds = rounds.loc[rounds['model'] != 'original']
  samples = algo_rounds.groupby('sample').count()[['score']].rename(columns={'score': 'count'})
  samples['winrate'] = algo_rounds.groupby('sample').sum()['score'] / samples['count']
  x = samples['winrate'].to_numpy()
  samples['score'] = np.maximum(0, (x - 0.5))**4 * samples['count']**3
  with pd.option_context('display.max_colwidth', None):
    print(samples.sort_values(['score', 'winrate', 'count'], ascending=False).iloc[:10])
  print()

  playback_a = df[['a', 'playbackTimeA']].rename(columns={'a': 'model', 'playbackTimeA': 'playback_time'}).dropna()
  playback_b = df[['b', 'playbackTimeB']].rename(columns={'b': 'model', 'playbackTimeB': 'playback_time'}).dropna()
  playbacks = pd.concat([playback_a, playback_b])
  print("########## PLAYBACK TIMES ##########")
  print(playbacks.groupby('model').mean().sort_values('playback_time', ascending=False))
  print()


if __name__ == '__main__':
  main()