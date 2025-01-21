<?php

namespace Native\Electron\Concerns;

trait LocatesPythonBinary
{
    /**
     * Returns the path to the directory containing the Python binary.
     *
     * @return string
     */
    protected function pythonBinaryDirectory(): string
    {
        // Default to vendor/nativephp/python-bin/, but allow overriding via env
        return env('NATIVEPHP_PYTHON_BINARY_PATH', 'vendor/nativephp/python-bin/');
    }

    /**
     * Returns the path to the Python binary (not including the filename).
     *
     * @return string
     */
    public function pythonBinaryPath(): string
    {
        return $this->pythonBinaryDirectory() . 'bin/';
    }

    /**
     * Returns the configured Python version, defaulting to 3.9.0 if not specified.
     *
     * @return string
     */
    public function pythonBinaryVersion(): string
    {
        return env('NATIVEPHP_PYTHON_BINARY_VERSION', '3.12.8');
    }
}