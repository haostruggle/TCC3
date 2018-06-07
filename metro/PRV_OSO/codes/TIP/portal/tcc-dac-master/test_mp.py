# coding: utf-8

import multiprocessing

def do_calc(data):
    return data * 2

def start_process():
    print('Starting', multiprocessing.current_process().name)


if __name__ == '__main__':
    input = list(range(10))
    print('Input: ', input)

    builtin_output = map(do_calc, input)
    print('Buildin: ', list(builtin_output))

    pool_size = multiprocessing.cpu_count() * 2
    pool = multiprocessing.Pool(processes=pool_size, initializer=start_process,)

    pool_output = pool.map(do_calc, input)
    pool.close()
    pool.join()

    print('Pool: ', pool_output)

