<?php

/*
 * Copyright 2012 Pavel Stupnikov <dp@dpointer.org>
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

namespace TwigJs\Compiler\Extension\I18n;

use TwigJs\JsCompiler;
use TwigJs\TypeCompilerInterface;

class TransCompiler implements TypeCompilerInterface
{
    public function getType()
    {
        return 'Twig_Extensions_Node_Trans';
    }

    public function compile(JsCompiler $compiler, \Twig_NodeInterface $node)
    {
        if (!$node instanceof \Twig_Extensions_Node_Trans) {
            throw new \RuntimeException(sprintf('$node must be an instanceof of \If, but got "%s".', get_class($node)));
        }

        list($msg, $vars) = $this->compileString($node->getNode('body'));

        if (null !== $node->getNode('plural')) {
            list($msg1, $vars1) = $this->compileString($node->getNode('plural'));
            $vars = array_merge($vars, $vars1);
        }

        $function = null === $node->getNode('plural') ? '$.gt.gettext' : '$.gt.ngettext';

        if ($vars) {
            $compiler
                ->write('sb.append(strtr('.$function.'(')
                ->subcompile($msg)
            ;

            if (null !== $node->getNode('plural')) {
                $compiler
                    ->raw(', ')
                    ->subcompile($msg1)
                    ->raw(', Math.abs(')
                    ->subcompile($node->getNode('count'))
                    ->raw(')')
                ;
            }

            $compiler->raw('), {');

            $first = true;
            foreach ($vars as $var) {
                if (!$first) $compiler->raw(', ');
                $first = false;
                if ('count' === $var->getAttribute('name')) {
                    $compiler
                        ->string('%count%')
                        ->raw(': Math.abs(')
                        ->subcompile($node->getNode('count'))
                        ->raw(')')
                    ;
                } else {
                    $compiler
                        ->string('%'.$var->getAttribute('name').'%')
                        ->raw(': ')
                        ->subcompile($var)
                    ;
                }
            }

            $compiler->raw("}));\n");

        } else {
            $compiler
                ->write('sb.append('.$function.'(')
                ->subcompile($msg)
            ;

            if (null !== $node->getNode('plural')) {
                $compiler
                    ->raw(', ')
                    ->subcompile($msg1)
                    ->raw(', Math.abs(')
                    ->subcompile($node->getNode('count'))
                    ->raw(')')
                ;
            }
            $compiler->raw("));\n");
        }
    }

    protected function compileString(\Twig_NodeInterface $body)
    {
        if ($body instanceof \Twig_Node_Expression_Name || $body instanceof \Twig_Node_Expression_Constant || $body instanceof \Twig_Node_Expression_TempName) {
            return array($body, array());
        }

        $vars = array();
        if (count($body)) {
            $msg = '';

            foreach ($body as $node) {
                if (get_class($node) === 'Twig_Node' && $node->getNode(0) instanceof \Twig_Node_SetTemp) {
                    $node = $node->getNode(1);
                }

                if ($node instanceof \Twig_Node_Print) {
                    $n = $node->getNode('expr');
                    while ($n instanceof \Twig_Node_Expression_Filter) {
                        $n = $n->getNode('node');
                    }
                    $msg .= sprintf('%%%s%%', $n->getAttribute('name'));
                    $vars[] = new \Twig_Node_Expression_Name($n->getAttribute('name'), $n->getLine());
                } else {
                    $msg .= $node->getAttribute('data');
                }
            }
        } else {
            $msg = $body->getAttribute('data');
        }

        return array(new \Twig_Node(array(new \Twig_Node_Expression_Constant(trim($msg), $body->getLine()))), $vars);
    }
}
